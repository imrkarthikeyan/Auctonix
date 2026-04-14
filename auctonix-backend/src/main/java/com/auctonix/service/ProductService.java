package com.auctonix.service;

import com.auctonix.exception.CustomException;
import com.auctonix.model.Product;
import com.auctonix.model.ProductStatus;
import com.auctonix.model.User;
import com.auctonix.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    //add new product
    public Product addProduct(Product product) {
        if (product.getBasePrice() == null) {
            product.setBasePrice(BigDecimal.ZERO);
        }
        product.setStatus(ProductStatus.UPCOMING);
        return productRepository.save(product);
    }

    //get product by id
    public Product getProductById(Long id) {
        return productRepository.findByIdWithOwner(id)
                .orElseThrow(() -> new CustomException("Product Not Found"));
    }

    //get products by status
    public List<Product> getProductsByStatus(ProductStatus status) {
        return productRepository.findByStatus(status);
    }

    //get products by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    //get products by owner
    public List<Product> getProductsByOwner(User owner) {
        return productRepository.findByOwner(owner);
    }

    //update product status
    public Product updateProductStatus(Long productId, ProductStatus status) {
        Product product = getProductById(productId);
        product.setStatus(status);
        return productRepository.save(product);
    }

    //update product final price(after auction)
    public Product updateFinalPrice(Long productId, BigDecimal finalPrice) {
        Product product = getProductById(productId);
        product.setFinalPrice(finalPrice);
        product.setStatus(ProductStatus.SOLD);
        return productRepository.save(product);
    }
}
