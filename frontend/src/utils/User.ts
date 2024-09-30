export class User {
    id: string;
    username: string;
    phone: string;
    email: string;
    phoneVerifiedAt: boolean;
    isEmailVerified: boolean;
    firstName: string;
    lastName: string;
    isAdmin: boolean;

    constructor(id: string, username: string, phone: string, email: string,
        isPhoneVerified: boolean = false, isEmailVerified: boolean = false,
        firstName: string, lastName: string, isAdmin = false) {
        this.id = id;
        this.username = username;
        this.phone = phone;
        this.email = email;
        this.phoneVerifiedAt = isPhoneVerified;
        this.isEmailVerified = isEmailVerified;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isAdmin = isAdmin;

    }
}

/**
 * reads user from value returned from api
 * @param user_data json object returned from api call
 * @returns User object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readUser(user_data: any): User {
    return new User(
        user_data["id"] ?? "",
        user_data["username"] ?? "",
        user_data["phone"] ?? "",
        user_data["email"] ?? "",
        !!user_data["phone_verified_at"],
        !!user_data["email_verified_at"],
        user_data["first_name"],
        user_data["last_name"],
        user_data["is_admin"],

    );
}