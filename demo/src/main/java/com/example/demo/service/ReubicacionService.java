package com.example.demo.service;

import com.example.demo.model.Area;
import com.example.demo.model.Contenedor;
import com.example.demo.model.InfoAreas;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReubicacionService {

    private final AreaService areaService;

    public ReubicacionService(AreaService areaService) {
        this.areaService = areaService;
    }

    public List<Contenedor> reubicarContenedores(InfoAreas infoAreas) {
        List<Area> predefinedAreas = areaService.getAreas();  // Obtener las áreas definidas con coordenadas
        List<Contenedor> resultContenedores = new ArrayList<>();

        for (Area predefinedArea : predefinedAreas) {
            Area infoArea = infoAreas.getAreas().stream()
                    .filter(a -> a.getId() == predefinedArea.getId())
                    .findFirst()
                    .orElse(null);

            if (infoArea != null && infoArea.getContenedores().isEmpty()) {
                for (Area otherArea : infoAreas.getAreas()) {
                    if (otherArea.getContenedores().size() > 1) {
                        Contenedor contenedor = otherArea.getContenedores().remove(0);
                        // Asignar las coordenadas del área destino al contenedor
                        contenedor.setX(predefinedArea.getX());
                        contenedor.setY(predefinedArea.getY());
                        resultContenedores.add(contenedor);
                        break;
                    }
                }
            } else if (infoArea != null) {
                infoArea.getContenedores().forEach(contenedor -> {
                    contenedor.setX(predefinedArea.getX());
                    contenedor.setY(predefinedArea.getY());
                    resultContenedores.add(contenedor);
                });
            }
        }

        return resultContenedores;
    }
}
