package org.andy.springend.controller;

import org.andy.springend.dto.CategoryClassifyDto;
import org.andy.springend.entities.Category;
import org.andy.springend.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/classify")
    public ResponseEntity<List<CategoryClassifyDto>> getAllCategoryClassifyDto() {
        System.out.println("getAllCategoryClassifyDto");
        System.out.println(categoryService.getAllCategoryClassifyDto());
        return ResponseEntity.ok(categoryService.getAllCategoryClassifyDto());
    }

}
