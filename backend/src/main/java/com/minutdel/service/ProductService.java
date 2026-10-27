package com.minutdel.service;

import com.minutdel.model.Category;
import com.minutdel.model.Product;
import com.minutdel.repository.CategoryRepository;
import com.minutdel.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AwsS3Service awsS3Service;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          AwsS3Service awsS3Service) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.awsS3Service = awsS3Service;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc();
    }

    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        products.forEach(this::enrichImageUrl);
        return products;
    }

    public List<Product> getProductsByCategorySlug(String slug) {
        List<Product> products = productRepository.findByCategorySlug(slug);
        products.forEach(this::enrichImageUrl);
        return products;
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }
        List<Product> products = productRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query.trim(), query.trim());
        products.forEach(this::enrichImageUrl);
        return products;
    }

    public Optional<Product> getProductById(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        productOpt.ifPresent(this::enrichImageUrl);
        return productOpt;
    }

    private void enrichImageUrl(Product product) {
        if (product != null && product.getImageUrl() != null) {
            product.setImageUrl(awsS3Service.resolveImageUrl(product.getImageUrl()));
        }
    }
}
