package com.caprisoft.caprisoft.entity;

public enum ProductStatus {
    DISPONIBLE("Disponible"),
    AGOTADO("Agotado"),
    DESCONTINUADO("Descontinuado");

    private final String displayName;

    ProductStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}