package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Courier;
import com.VisionExpress.demo.repository.CourierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourierService {

    private final CourierRepository courierRepository;

    @Autowired
    public CourierService(CourierRepository courierRepository) {
        this.courierRepository = courierRepository;
    }

    public Courier addCourier(Courier courier) {
        if (courier.getCompanyName() == null || courier.getCompanyName().trim().isEmpty()) {
            throw new IllegalArgumentException("Company name cannot be empty.");
        }
        return courierRepository.save(courier);
    }

    public List<Courier> getAllCouriers() {
        return courierRepository.findAll();
    }

    public Courier getCourierById(Integer id) {
        return courierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Courier not found with ID: " + id));
    }

    public List<Courier> getCouriersByServiceType(String serviceType) {
        return courierRepository.findByServiceType(serviceType);
    }

    public Courier updateCourier(Integer id, Courier updatedCourier) {
        Courier existingCourier = getCourierById(id);
        existingCourier.setCompanyName(updatedCourier.getCompanyName());
        existingCourier.setContactNumber(updatedCourier.getContactNumber());
        existingCourier.setServiceType(updatedCourier.getServiceType());
        return courierRepository.save(existingCourier);
    }

    public void deleteCourier(Integer id) {
        if (!courierRepository.existsById(id)) {
            throw new RuntimeException("Courier not found with ID: " + id);
        }
        courierRepository.deleteById(id);
    }
}