package com.example.demo.repository;

import com.example.demo.model.Contenedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContenedorRepository extends JpaRepository<Contenedor, Long> {
    // No se necesita método adicional
}
