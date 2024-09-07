import api from "../../api";
import { API_URL } from "../../constants/BaseUrl";
import { useLocation } from "react-router-dom";

function SearchPage() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');
    const loadSearchResult = async () => {
        try {
            if (query) {
                const response = api.get(`products/search?query=${encodeURIComponent(query)}`);
                console.log(response);
            }
        } catch (error) {

        }
    };
    loadSearchResult();
    return (
        <div>
            search result here.
        </div>
    );
}
export default SearchPage;