import { useState, useRef, FormEvent } from "react";
import api from "../../helpers/api";
import React from "react";
import "./Sell.css";
import "../../styles/Loader.css";
import { useRequireAuthentication } from "../login/LoginRedirect";
import FileInputButton from "../../components/FileInput/FileInputButton";
import FileDropArea from "../../components/FileInput/FileDropArea";
import { Link, useParams } from "react-router-dom";
import useCategories from "../../helpers/useCategories";
import useProduct from "../../helpers/useProduct";
import { Category } from "../../utils/Category";
import InputError from "../../components/InputError/InputError";
import FileInputError from "../../components/FileInput/FileInputError";

const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/svg+xml",
];
const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    useRequireAuthentication();
    const { categories, messageElement } = useCategories();
    if (!categories && messageElement) {
        return messageElement;
    }
    if (id) {

    }

    return <NewProduct categoris={categories} />;

};
function NewProduct({ categoris }: { categoris? :Category[]|null}) {
    const [productData, setProductData] = useState(emptyProductData);
    const [isLoading, setIsLoading] = useState(false);
    const [createdProductId, setCreatedProductId] = useState<number | null>(null);
    const resetForm = () => {
        setProductData(emptyProductData);
        setIsLoading(false);
        setCreatedProductId(null);
    }
    const handleSubmit = () => {
        setIsLoading(true);
        api.post("/sellers/products", productData, {
                headers: { "Content-Type": "multipart/form-data" },
            }).then(response => {
                const data = response.data;
                setCreatedProductId(data.id);
            }).catch(error => {
                console.error("Error submitting product:", error);
            }).finally(() => {
                setIsLoading(false);
            });
    }
    if (createdProductId) {
        return (
            <div className="product-created-successfully">
                <p>
                    تمت إضافة المنتج بنجاح
                </p>
                <Link to={`/seller-portal/products/${createdProductId}`} className="button">
                    عرض المنتج
                </Link>
                <button className="button" onClick={resetForm}>
                    إضافة منتج آخر
                </button>
            </div>
        );
    }
    return (
        <Form productData={productData} setProductData={setProductData}
            categories={categoris} isLoading={isLoading} imageRequeried
            handleSubmit={handleSubmit} />
    );
}
const emptyProductData:ProductData = {
    title: "",
    description: "",
    price: "",
    image: null,
    category_id:"",
} 
interface ProductData {
    title: string;
    description: string;
    price: string;
    image: File | null,
    category_id: string,
}
interface FormProps {
    productData: ProductData, setProductData: (productData: ProductData) => void, oldImage?: string, handleSubmit: () => void,categories?: Category[]|null,imageRequeried?:boolean,isLoading:boolean
}
function Form({ productData, setProductData, imageRequeried, oldImage, categories, handleSubmit, isLoading }: FormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);
    const priceInputRef = useRef<HTMLInputElement>(null);
    const [triggerValidate, setTriggerValidate] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const setImageFile = (imageFile: File | null) => {
        const newProductDate = {
            ...productData,
            'image':imageFile
        };
        setProductData(newProductDate);
    }
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setImageFile(file);
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setProductData({
            ...productData,
            [name]: value,
        })
    };
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!triggerValidate) {
            console.log(triggerValidate);
            setTriggerValidate(true);
        }
        const form = formRef.current;
        if (form) {
            const inputs = Array.from(form.elements).filter(
                (element) => (element as HTMLInputElement).checkValidity !== undefined
            ) as HTMLInputElement[];
            if (!form.checkValidity() || inputs.some(input => !input.checkValidity())) {
                return;
            }
        }
        const formData = new FormData();
        formData.append("title", productData.title);
        formData.append("description", productData.description);
        formData.append("price", productData.price);
        if (productData.image) {
            formData.append("image", productData.image);
        }        
        handleSubmit();
    };
    return (
        <form className="sell-form" action="" ref={formRef}>
            <h2 className="objective">مواصفات المنتج:</h2>
            <label htmlFor="title" className="lab">
                الاسم
            </label>
            <input
                type="text"
                id="title"
                name="title"
                minLength={3}
                maxLength={30}
                value={productData.title}
                onChange={handleChange}
                className="name"
                ref={titleInputRef}
                required
            />
            <InputError input={titleInputRef.current} name="اسم المنتج" triggerValidate={triggerValidate} />
            <label htmlFor="description" className="lab">
                المواصفات
            </label>
            <input
                type="text"
                id="description"
                name="description"
                value={productData.description}
                minLength={8}
                maxLength={255 }
                onChange={handleChange}
                className="description"
                ref={descriptionInputRef}
                required
            />
            <InputError input={descriptionInputRef.current} name="وصف المنتج" triggerValidate={triggerValidate} detailedLengthError/>

            <label htmlFor="price" className="lab">
                السعر
            </label>
            <input
                type="text"
                id="price"
                name="price"
                pattern="^\d+(\.\d{1,2})?$"
                inputMode="numeric"
                min={2}
                max={999999.99}
                maxLength={9 }
                value={productData.price}
                onChange={handleChange}
                className="price"
                ref={priceInputRef}
                required
            />

            <InputError input={priceInputRef.current} name="السعر" triggerValidate={triggerValidate} detailedLengthError />
            <label htmlFor="category_id" className="lab">
                الفئة
            </label>
            {categories && categories.length > 0 &&
                <select id="category_id" name="category_id" value={productData.category_id} onChange={handleChange}>
                    {categories && categories.length > 0 &&
                        categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    <option value={""}>
                        غير محدد
                    </option>
                </select>
            }
            {/* Display existing image if present */}
            {oldImage && (
                <div>
                    <img src={oldImage} className="sell-current-image" />
                    <p>الصورة القديمة</p>
                </div>
            )}
            <label htmlFor="image" className="lab">
                الصوره
            </label>
            <input
                type="file"
                id="image"
                name="image"
                accept={allowedFileTypes.join(",")}
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
            />
            <FileInputButton file={productData.image} triggerFileInput={triggerFileInput}>
                اختر صورة المنتج
            </FileInputButton>
            <FileDropArea
                file={productData.image}
                setFile={setImageFile}
            />
            <FileInputError input={fileInputRef.current } file={productData.image} allowedTypes={allowedFileTypes} maxSizeInBytes={2048 * 1024} required={imageRequeried} triggerValidate={triggerValidate} />
            <button type="submit" className="submittionbutton" onClick={submit } disabled={isLoading}>
                {isLoading ? "يتم تحديث المنتج" : "ارسل"}
            </button>
        </form>
    );
}
export default ProductForm;
