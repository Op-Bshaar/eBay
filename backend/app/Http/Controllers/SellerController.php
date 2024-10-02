<?php


namespace App\Http\Controllers;

use App\Models\OrderRequestItem;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderShipped;
use Illuminate\Support\Facades\Mail;
use App\Jobs\SendOrderShippedEmail;

class SellerController extends Controller
{

    public function getProducts(Request $request)
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            return response()->json([]);
        }
        $products = $seller->products;
        return response()->json($products);
    }

    public function getproduct($id)
    {
        $product = Product::with('seller')->findOrFail($id);

        return response()->json($product);
    }


    public function getOrders(Request $request)
    {
        $seller = $request->user()->seller;


        if (!$seller) {
            return response()->json([]);
        }


        $productIds = $seller->products()->pluck('id');


        $orders = OrderRequestItem::whereIn('product_id', $productIds)
        ->whereNotIn('status', ['canceled', 'failed', 'timeout'])
            ->with('product')
            ->get();

        return response()->json($orders);
    }


    public function addProducts(Request $request)
    {

        $request->validate([
            'title' => 'required|string|max:30',
            'description' => 'required|string|max:255',
            'price' => 'required|numeric|min:0|max:999999.99',
            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'catogery_id'=>'nullable|exists:catogeries,id'
        ]);

        $user = $request->user();
        $seller = $user->seller;
        if (!$seller) {
            $seller = Seller::create([
                'user_id' => $user->id,
            ]);
            $seller->save();
        }
        if ($request->hasFile('image')) {

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();


            $image->move(public_path('images'), $imageName);

            $category_id  = $request->category_id ;
            if(!$category_id   || empty($category_id )){
                $category_id  = null;
            }
            $product = Product::create([
                'title' => $request->title,
                'description' => $request->description,
                'price' => $request->price,
                'image' => $imageName,
                'seller_id' => $seller->id,
                'category_id' =>$category_id,
            ]);


            return response()->json($product, 201);
        } else {

            return response()->json(['error' => 'Image upload failed'], 400);
        }
    }

    public function updateProduct(Request $request, $id)
    {

        $product = Product::findOrFail($id);
        
        $seller = $request->user()->seller;
        if(!$seller || $seller->id !== $product->seller_id){
            return response()->json(['message' => 'unauthorized',401 ]);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0|max:999999.99',
        ]);


        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();

            $image->move(public_path('images'), $imageName);


            if ($product->image) {
                $oldImagePath = public_path('images/' . $product->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }


            $validatedData['image'] = $imageName;
        } else {

            $validatedData['image'] = $product->image;
        }


        $product->update($validatedData);


        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }



    public function deleteProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $seller = $request->user()->seller;
        if(!$seller || $seller->id !== $product->seller_id){
            return response()->json(['message' => 'unauthorized',401 ]);
        }
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully',200]);
    }

    public function getOrderItem(Request $request, $order_id)
    {
        $seller = $request->user()->seller;
        $order = OrderRequestItem::with(['product', 'orderRequest'])->findOrFail($order_id);
        if (!$seller || $order->product->seller_id !== $seller->id) {
            return response()->json(['message' => 'unauthorized'], 401);
        }
        return response()->json(['order' => $order], 200);
    }
    public function getCurrentSeller(Request $request)
    {
        $user = $request->user();
        $seller = $user->seller;
        if (!$seller) {
            $seller = Seller::create([
                'user_id' => $user->id,
            ]);
            return response()->json(['seller' => $seller], 201);
        }
        return response()->json(['seller' => $seller], 200);
    }

    public function setBankInfo(Request $request){
        $validatedData = $request->validate([
            'bank_name' => 'required|string|max:100',
            'bank_recepient_name' => 'required|string|max:100',
            'bank_account_number' => 'required|string|max:50',
            'iban' => 'required|string|max:34|regex:/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/', // Ensure IBAN starts with 2 letters followed by digits and alphanumeric characters
        ]);
        $seller = $request->user()->seller;
            // Check if the seller exists; if not, return a 404 response
        if (!$seller) {
            return response()->json(['message' => 'Seller not found.'], 404);
        }
        $seller->bank_name = $validatedData['bank_name'];
        $seller->bank_recepient_name = $validatedData['bank_recepient_name'];
        $seller->bank_account_number = $validatedData['bank_account_number'];
        $seller->iban = $validatedData['iban'];
    
        // Save the changes
        $seller->save();
    
        // Return a success response
        return response()->json(['message' => 'Bank information updated successfully.'], 200);
    }
    public function shipOrder(Request $request,$orderId)
    {
        $request->validate([
            'shipping_company'=>'required|string|max:100',
            'shipment_number'=>'required|string|max:100',
        ]);
        $seller = $request->user()->seller;
        $order = OrderRequestItem::with('product')->findOrFail($orderId);
        // Check if the seller is authorized to ship this order
        if (!$seller || $order->product->seller_id !== $seller->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        if (!in_array($order->status, ['paid', 'notified-seller'])) {
            return response()->json(['message' => 'Order cannot be shipped in its current status'], 400);
        }
        $order->shipping_company = $request->shipping_company;
        $order->shipment_number = $request->shipment_number;
        $order->status = 'shipped';
        $order->save();
        SendOrderShippedEmail::dispatch($order);
        return response()->json(['message' => 'Order shipped successfully', 'order' => $order], 200);
    }
}
