package org.andy.springend.service;

import jakarta.persistence.Tuple;
import org.andy.springend.dto.CategoryClassifyDto;
import org.andy.springend.entities.Category;
import org.andy.springend.repo.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<CategoryClassifyDto> getAllCategoryClassifyDto() {
        List<Tuple> tuples = categoryRepository.findAllCategoryClassifyDto();
        return tuples.stream().map(tuple -> CategoryClassifyDto.builder()
                .name(tuple.get(0, String.class))
                .certCount(tuple.get(1, Long.class))
                .build()).toList();
    }

}
