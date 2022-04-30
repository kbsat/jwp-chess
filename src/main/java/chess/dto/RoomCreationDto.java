package chess.dto;

public class RoomCreationDto {

    private String name;
    private String password;

    private RoomCreationDto() {
    }

    public RoomCreationDto(String name, String password) {
        this.name = name;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }
}
