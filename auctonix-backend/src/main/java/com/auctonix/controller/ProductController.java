package com.auctonix.controller;

import com.auctonix.dto.ProductDTO;
import com.auctonix.model.Product;
import com.auctonix.model.ProductStatus;
import com.auctonix.model.User;
import com.auctonix.service.ProductService;
import com.auctonix.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final UserService userService;

    //add new product
    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(
            @RequestParam Long ownerId,
            @RequestParam String imageUrl,
            @RequestParam String pdfUrl,
            @RequestBody Product product) {

        User owner = userService.getUserById(ownerId);
        product.setOwner(owner);

        product.setImageUrl(imageUrl);
        product.setPdfUrl(pdfUrl);

        Product savedProduct = productService.addProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    //get product by id
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        //Product product = productService.getProductById(id);
        Product product = productService.getProductById(id);
        User owner = product.getOwner();

        ProductDTO dto = ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .category(product.getCategory())
                .basePrice(product.getBasePrice())
                .finalPrice(product.getFinalPrice())
                .status(product.getStatus())
                .ownerId(owner != null ? owner.getId() : null)
                //                .ownerName(product.getOwner().getName())
                .ownerName(owner != null ? owner.getName() : null)
                .ownerEmail(owner != null ? owner.getEmail() : null)
                .ownerPhone(owner != null ? owner.getPhone() : null)
                .imageUrl(product.getImageUrl())
                .pdfUrl(product.getPdfUrl())
                .build();

        return ResponseEntity.ok(dto);
    }

    //get products by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProductDTO>> getProductsByStatus(@PathVariable ProductStatus status) {
        List<Product> products = productService.getProductsByStatus(status);

        List<ProductDTO> dtos = products.stream().map(p -> ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .category(p.getCategory())
                .basePrice(p.getBasePrice())
                .finalPrice(p.getFinalPrice())
                .ownerId(p.getOwner().getId())
                .ownerName(p.getOwner().getName())
                .status(p.getStatus())
                .build()
        ).toList();

        return ResponseEntity.ok(dtos);
    }

    //get products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    //get products by owner
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Product>> getProductsByOwner(@PathVariable Long ownerId) {
        User owner = userService.getUserById(ownerId);
        List<Product> products = productService.getProductsByOwner(owner);
        return ResponseEntity.ok(products);
    }

    //update product status(for admin)
    @PutMapping("/{id}/status")
    public ResponseEntity<Product> updateProductStatus(@PathVariable Long id, @RequestParam ProductStatus status) {
        Product product = productService.updateProductStatus(id, status);
        return ResponseEntity.ok(product);
    }
}
