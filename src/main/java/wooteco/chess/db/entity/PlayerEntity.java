package wooteco.chess.db.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("player")
public class PlayerEntity {
	@Id
	@Column("player_id")
	private Long id;
	private final String name;
	private final String password;
	private final String team;

	public PlayerEntity(String name, String password, String team) {
		this.name = name;
		this.password = password;
		this.team = team;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getPassword() {
		return password;
	}

	public String getTeam() {
		return team.toUpperCase();
	}
}