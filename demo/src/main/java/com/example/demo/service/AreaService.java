package com.example.demo.service;

import com.example.demo.model.Area;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AreaService {
    public List<Area> getAreas() {
        return List.of(
            new Area(1, 75, 95, new ArrayList<>()),
            new Area(2, 295, 525, new ArrayList<>()),
            new Area(3, 420, 525, new ArrayList<>()),
            new Area(4, 545, 525, new ArrayList<>()),
            new Area(5, 670, 525, new ArrayList<>()),
            new Area(6, 795, 525, new ArrayList<>()),
            new Area(7, 920, 525, new ArrayList<>()),
            new Area(8, 1045, 525, new ArrayList<>()),
            new Area(9, 295, 580, new ArrayList<>()),
            new Area(10, 420, 580, new ArrayList<>()),
            new Area(11, 545, 580, new ArrayList<>()),
            new Area(12, 670, 580, new ArrayList<>()),
            new Area(13, 795, 580, new ArrayList<>()),
            new Area(14, 920, 580, new ArrayList<>()),
            new Area(15, 1045, 580, new ArrayList<>()),
            new Area(16, 295, 635, new ArrayList<>()),
            new Area(17, 420, 635, new ArrayList<>()),
            new Area(18, 545, 635, new ArrayList<>()),
            new Area(19, 670, 635, new ArrayList<>()),
            new Area(20, 795, 635, new ArrayList<>()),
            new Area(21, 920, 635, new ArrayList<>()),
            new Area(22, 1045, 635, new ArrayList<>()),
            new Area(23, 295, 687, new ArrayList<>()),
            new Area(24, 420, 687, new ArrayList<>()),
            new Area(25, 545, 687, new ArrayList<>()),
            new Area(26, 670, 687, new ArrayList<>()),
            new Area(27, 795, 687, new ArrayList<>()),
            new Area(28, 920, 687, new ArrayList<>()),
            new Area(29, 1045, 687, new ArrayList<>())
        );
    }
}
