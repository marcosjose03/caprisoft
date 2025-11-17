package com.caprisoft.caprisoft.entity;

public enum OrderStatus {
    PENDIENTE("Pendiente"),
    CONFIRMADO("Confirmado"),
    EN_PREPARACION("En Preparación"),
    ENVIADO("Enviado"),
    ENTREGADO("Entregado"),
    CANCELADO("Cancelado");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}