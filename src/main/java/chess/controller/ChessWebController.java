package chess.controller;

import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;
import static spark.Spark.staticFiles;

import chess.JsonTransformer;
import chess.service.ChessService;
import chess.service.dto.ChessSaveRequestDto;
import chess.service.dto.CommonResponseDto;
import chess.service.dto.GameStatusRequestDto;
import chess.service.dto.MoveRequestDto;
import chess.service.dto.ResponseCode;
import chess.service.dto.TilesDto;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;
import spark.ModelAndView;
import spark.template.handlebars.HandlebarsTemplateEngine;

public class ChessWebController {

    private final ChessService chessService;

    public ChessWebController(final ChessService chessService) {
        this.chessService = chessService;
    }

    private static String render(final Map<String, Object> model, final String templatePath) {
        return new HandlebarsTemplateEngine().render(new ModelAndView(model, templatePath));
    }

    public void run() {
        staticFiles.location("/static");

        final JsonTransformer jsonTransformer = new JsonTransformer();

        get("/", (request, response) -> {
            final Map<String, Object> model = new HashMap<>();
            return render(model, "main.html");
        });

        get("/games", (request, response) -> {
            final TilesDto tilesDto = chessService.emptyBoard();
            final Map<String, Object> model = new HashMap<>();
            model.put("tilesDto", tilesDto);
            return render(model, "board.html");
        });

        post("/api/games", (request, response) -> {
            final ChessSaveRequestDto requestDto = new Gson().fromJson(request.body(), ChessSaveRequestDto.class);
            return chessService.startChess(requestDto);
        }, jsonTransformer);

        put("/api/games", (request, response) -> {
            final GameStatusRequestDto requestDto = new Gson().fromJson(request.body(), GameStatusRequestDto.class);
            chessService.changeGameStatus(requestDto);
            return new CommonResponseDto<>(ResponseCode.OK.code(), ResponseCode.OK.message());
        }, jsonTransformer);

        get("/api/games/:name", (request, response) -> {
            final String name = request.params(":name");
            return chessService.loadChess(name);
        }, jsonTransformer);

        put("/api/games/:name/pieces", (request, response) -> {
            final MoveRequestDto requestDto = new Gson().fromJson(request.body(), MoveRequestDto.class);
            return chessService.movePiece(request.params(":name"), requestDto);
        }, jsonTransformer);
    }
}