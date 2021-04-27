let currentRoomName = document.getElementById("roomName").value;

createChessBoard();

const startButton = document.getElementById("start");
const backButton = document.getElementById("back");
const scoreButton = document.getElementById("score");

startButton.addEventListener("click", clickStart);
backButton.addEventListener("click", clickBack);
scoreButton.addEventListener("click", clickScore);

function createChessBoard() {
    makeTable();
    syncBoard();
    changeTurn();
    addEvent();
}

function makeTable() {
    const table = document.getElementById("chess-board");
    for (let i = 0; i < 8; i++) {
        const newTr = document.createElement("tr");
        for (let j = 0; j < 8; j++) {
            const newTd = document.createElement("td");

            const row = String(8 - i);
            const column = String.fromCharCode('a'.charCodeAt(0) + j);
            newTd.id = column + row;
            if ((i % 2 === 0 && j % 2 === 0) || (i % 2 !== 0 && j % 2 !== 0)) {
                newTd.className = "whiteTile";
            } else {
                newTd.className = "blackTile";
            }
            table.appendChild(newTd);
        }
        table.appendChild(newTr);
    }
}

function addEvent() {
    const table = document.getElementById("chess-board");
    table.addEventListener("click", selectTile);
}

function selectTile(event) {
    const clickPiece = event.target.closest("td");
    const clickedPiece = getClickedPiece();
    if (clickedPiece) {
        clickedPiece.classList.remove("clickedTile");
        clickedPiece.classList.toggle("clicked");
        if (clickedPiece !== clickPiece) {
            move(clickedPiece.id, clickPiece.id);
        }
    } else {
        clickPiece.classList.toggle("clicked");
        clickPiece.classList.add("clickedTile");
    }
}

function getClickedPiece() {
    const pieces = document.getElementsByTagName("td");
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].classList.contains("clicked")) {
            return pieces[i];
        }
    }
    return null;
}

async function move(from, to) {
    let data = {
        from: from,
        to: to
    }
    let response = await fetch('/api/rooms/' + currentRoomName + '/move', {
        method: 'put',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const status = response.status;
    if (status === 200) {
        response = await response.json();
        if (response.code === "SUCCEED") {
            changeImage(from, to);
            await changeTurn();
            return;
        }
        if (response.code === "GAME_SET") {
            changeImage(from, to);
            const currentTurn = document.querySelector('.turn');
            currentTurn.textContent = response.turn;
            alert(response.message + "가 승리했습니다!");
            return;
        }
    }
    if (status === 400 || status === 500) {
        response = await response.text();
        alert(response);
    }
}

function changeImage(sourcePosition, targetPosition) {
    const source = document.getElementById(sourcePosition);
    const target = document.getElementById(targetPosition);
    const piece = source.getElementsByTagName("img")[0];
    if (target.getElementsByTagName("img")[0]) {
        target.getElementsByTagName("img")[0].remove();
    }
    target.appendChild(piece);
}

async function syncBoard() {
    let response = await fetch('/api/rooms/' + currentRoomName + '/board', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 400 || response.status === 500) {
        response = await response.text();
        alert(response);
        window.location.href = "http://localhost:8080/";
    }

    let board = await response.json();
    const positions = Object.keys(board);
    const pieces = Object.values(board);
    for (let i = 0; i < positions.length; i++) {
        const position = document.getElementById(positions[i]);
        if (position.getElementsByTagName("img")[0]) {
            position.getElementsByTagName("img")[0].remove();
        }
        if (pieces[i] === ".") {
            continue;
        }
        const piece = document.createElement("img");

        piece.src = "/images/" + pieces[i] + ".png";
        position.appendChild(piece);
    }
}

async function changeTurn() {
    const response = await fetch('/api/rooms/' + currentRoomName + '/turn', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => {
        return res.json();
    });

    const currentTurn = document.querySelector('.turn');
    currentTurn.textContent = response.turn;
}

function clickStart() {
    if (confirm("재시작하시겠습니까?")) {
        fetch('/api/rooms/' + currentRoomName + '/restart', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function () {
            syncBoard();
            changeTurn();
        });
    }
}

async function clickBack() {
    if (confirm("목록으로 돌아가시겠습니까?")) {
        window.location.href = "http://localhost:8080/";
    }
}

async function clickScore() {
    const score = await fetch('/api/rooms/' + currentRoomName + '/score', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json();
    });

    alert("White 점수 : " + score.whiteScore + "\nBlack 점수 : " + score.blackScore);
}