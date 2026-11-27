package com.example.storerating.dto;

public final class ValidationRules {

    public static final String PASSWORD_REGEX = "^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$";
    public static final String PASSWORD_MESSAGE =
            "Password must be 8-16 characters with at least one uppercase letter and one special character";

    public static final String EMAIL_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    public static final String EMAIL_MESSAGE = "Enter a valid email address";

    public static final String NAME_MESSAGE = "Name must be between 20 and 60 characters";
    public static final String ADDRESS_MESSAGE = "Address is required and can be at most 400 characters";

    private ValidationRules() {
    }
}
