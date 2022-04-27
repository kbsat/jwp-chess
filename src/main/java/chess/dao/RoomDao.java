package chess.dao;

import chess.entity.Room;
import java.util.List;
import java.util.Optional;

public interface RoomDao {
    long save(Room room);

    Optional<Room> findById(long id);

    List<Room> findAll();

    void updateTurn(long id, String turn);

    void deleteRoom(long id);
}
