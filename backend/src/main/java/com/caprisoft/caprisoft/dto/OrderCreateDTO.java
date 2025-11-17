package com.caprisoft.caprisoft.dto;

import com.caprisoft.caprisoft.entity.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderCreateDTO {

    @NotEmpty(message = "El pedido debe tener al menos un producto")
    @Valid
    private List<OrderItemCreateDTO> items;

    @NotNull(message = "El método de pago es obligatorio")
    private PaymentMethod paymentMethod;

    @NotBlank(message = "El nombre de entrega es obligatorio")
    private String deliveryName;

    @NotBlank(message = "El teléfono es obligatorio")
    private String deliveryPhone;

    @NotBlank(message = "La dirección es obligatoria")
    private String deliveryAddress;

    @NotBlank(message = "La ciudad es obligatoria")
    private String deliveryCity;

    private String notes;
}