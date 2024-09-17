import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faComputer, faHeadphones, faLaptop, faMicrochip } from "@fortawesome/free-solid-svg-icons";

export const itemdata = [
    {
        id: 1,
        item: "ساعات",
        icon: <FontAwesomeIcon icon={faComputer} style={{ color: "gray" }} />
    },
    {
        id: 2,
        item: "لابتوبات",
        icon: <FontAwesomeIcon icon={faLaptop} style={{ color: "gray" }} />
    },
    {
        id: 40,
        item: "ساعات",
        icon: <FontAwesomeIcon icon={faLaptop} style={{ color: "gray" }} />
    },
    {
        id: 4,
        item: "سماعات",
        icon: <FontAwesomeIcon icon={faHeadphones} style={{ color: "gray" }} />
    },
    {
        id: 5,
        item: "أجهزة",
        icon: <FontAwesomeIcon icon={faBox} style={{ color: "gray" }} />
    },
    {
        id: 6,
        item: "ملحقات حاسوب",
        icon: <FontAwesomeIcon icon={faMicrochip} style={{ color: "gray" }} />
    },
    {
        id: 7,
        item: "كمبيوتر",
        icon: <FontAwesomeIcon icon={faComputer} style={{ color: "gray" }} />
    },
    {
        id: 41,
        item: "شرائح",
        icon: <FontAwesomeIcon icon={faComputer} style={{ color: "gray" }} />
    },
    {
        id: 9,
        item: "أجخزة منزلية",
        icon: <FontAwesomeIcon icon={faComputer} style={{ color: "gray" }} />
    }
]

export interface User {
    id: number,
    username: string,
    email: string,
    phone: string,
    is_admin: boolean,
}