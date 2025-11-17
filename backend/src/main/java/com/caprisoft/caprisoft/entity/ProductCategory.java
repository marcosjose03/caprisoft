package com.caprisoft.caprisoft.entity;

public enum ProductCategory {
    LECHE("Leche y Derivados"),
    CARNE("Carne Caprina"),
    QUESO("Quesos"),
    YOGURT("Yogurt y Bebidas"),
    OTROS("Otros Productos");

    private final String displayName;

    ProductCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}