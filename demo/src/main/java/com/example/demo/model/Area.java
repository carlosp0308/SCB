package com.example.demo.model;

import java.util.List;

public class Area {
    private int id;
    private double x;
    private double y;
    private List<Contenedor> contenedores;

    public Area(int id, double x, double y, List<Contenedor> contenedores) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.contenedores = contenedores;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public List<Contenedor> getContenedores() {
        return contenedores;
    }

    public void setContenedores(List<Contenedor> contenedores) {
        this.contenedores = contenedores;
    }
}
