package com.caprisoft.caprisoft.entity;

public enum PaymentMethod {
    CASH("Efectivo"),
    TRANSFER("Transferencia"),
    CARD("Tarjeta");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}