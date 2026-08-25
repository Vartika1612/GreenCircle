package com.greencircle.dto;

public class UserSummaryResponse {
    private Long id;
    private String name;
    private String location;

    public UserSummaryResponse() {}

    public UserSummaryResponse(Long id, String name, String location) {
        this.id = id;
        this.name = name;
        this.location = location;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
