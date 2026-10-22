package com.ovms;

import java.sql.Timestamp;

public class Visitor {
    private int id;
    private String name;
    private String empId;
    private String email;
    private String department;
    private String purpose;
    private String expectedDate;
    private String status;
    private Timestamp checkinTime;
    private Timestamp checkoutTime;

    public Visitor() {}

    // Constructor for Pre-Registration
    public Visitor(String name, String empId, String email, String department, String purpose, String expectedDate) {
        this.name = name;
        this.empId = empId;
        this.email = email;
        this.department = department;
        this.purpose = purpose;
        this.expectedDate = expectedDate;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getExpectedDate() { return expectedDate; }
    public void setExpectedDate(String expectedDate) { this.expectedDate = expectedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCheckinTime() { return checkinTime; }
    public void setCheckinTime(Timestamp checkinTime) { this.checkinTime = checkinTime; }

    public Timestamp getCheckoutTime() { return checkoutTime; }
    public void setCheckoutTime(Timestamp checkoutTime) { this.checkoutTime = checkoutTime; }
}