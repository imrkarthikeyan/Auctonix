package com.auctonix.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MLRequest {
    private String modelType; // BASE_PRICE, FRAUD, RECOMMENDATION, TREND, SENTIMENT
    private Map<String, Object> inputData; // dynamic input data for ML model
}
