
function draw(){
    colorRect(0,0, canvas.width, canvas.height, "rgb(64, 89, 122)");

    game_history.draw();

    draw_board();
    draw_selected_tile();
    draw_file_rank_indicators()

    let split_board_string = game_ref.board.split("/");

    draw_pieces(split_board_string);
    draw_movable_tiles(split_board_string);

    if(game_ref.pawn_upgrade[0] != -1) draw_pawn_upgrade();

    rematch_button.visible = false;
    if(game_ref.game_over != -1) draw_game_over();

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].display();
    }
}

function draw_board(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            let color = ((i + j) % 2 == 0) ? "white" : "rgb(18,18,18)";
            let oposite_color = ((i + j) % 2 == 1) ? "rgb(18,18,18)" : "white";

            colorRect(BOARD_DIM[0]+INDIVIDUAL_DIM[0]*j, BOARD_DIM[1]+INDIVIDUAL_DIM[1]*i, INDIVIDUAL_DIM[0], INDIVIDUAL_DIM[1], color);
        }
    }

    if(game_ref.king_in_check != false){
        colorRect(BOARD_DIM[0]+INDIVIDUAL_DIM[0]*game_ref.king_in_check[1], BOARD_DIM[1]+INDIVIDUAL_DIM[1]*game_ref.king_in_check[0], INDIVIDUAL_DIM[0], INDIVIDUAL_DIM[1], "rgb(236, 164, 91)");
    } 

    colorNoFillRect(BOARD_DIM[0], BOARD_DIM[1], BOARD_DIM[2], BOARD_DIM[3], "rgb(18,18,18)", 4);
}

function draw_selected_tile(){
    if(tile_selected[0] == -1 || tile_selected[1] == -1) return;

    colorRect(BOARD_DIM[0]+INDIVIDUAL_DIM[0]*tile_selected[1], BOARD_DIM[1]+INDIVIDUAL_DIM[1]*tile_selected[0], INDIVIDUAL_DIM[0], INDIVIDUAL_DIM[1], "grey");
    
    colorNoFillRect(BOARD_DIM[0], BOARD_DIM[1], BOARD_DIM[2], BOARD_DIM[3], "black", 4);
}

function draw_file_rank_indicators(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            let oposite_color = ((i + j) % 2 == 0) ? "black" : "white";
            let file = FILES[j];
            let rank = 8-i;
            
            if(game_ref.white_side == 0){
                file = FILES[7-j];
                rank = i+1;
            }

            if(j == 0) drawText(oposite_color, "32px pixel_font", rank, BOARD_DIM[0]+INDIVIDUAL_DIM[0]*j+5, BOARD_DIM[1]+INDIVIDUAL_DIM[1]*i+20);
            if(i == 7) drawText(oposite_color, "32px pixel_font", file, BOARD_DIM[0]+INDIVIDUAL_DIM[0]*j+INDIVIDUAL_DIM[0]-15, BOARD_DIM[1]+INDIVIDUAL_DIM[1]*i+INDIVIDUAL_DIM[1]-10);
        }
    }
}

function draw_pieces(board){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){

            if(board[i_1D(i, j)] == "e" || board[i_1D(i, j)].slice(1) == "enp") continue;
            if(piece_in_hand[0] == i && piece_in_hand[1] == j) continue;

            let piece = pieces_img_data[PIECES_DATA[board[i_1D(i, j)]]]
            let dx = BOARD_DIM[0] + j * INDIVIDUAL_DIM[0] + INDIVIDUAL_DIM[0]/2;
            let dy = BOARD_DIM[1] + i * INDIVIDUAL_DIM[1] + INDIVIDUAL_DIM[1]/2 - 5*piece.dh/12;

            piece.draw(dx, dy);
        }
    }

    if(piece_in_hand[0] != -1 && piece_in_hand[1] != -1 && board[i_1D(piece_in_hand[0], piece_in_hand[1])] != "e"){
        let piece = pieces_img_data[PIECES_DATA[board[i_1D(piece_in_hand[0], piece_in_hand[1])]]]
        piece.draw(mouseX, mouseY);
    }
}

function draw_movable_tiles(board){
    for (let i = 0; i < movable_tiles.length; i++) {
        let not_empty = board[i_1D(movable_tiles[i][0], movable_tiles[i][1])] != "e";
        let not_from_a_pawn_to_enp = board[i_1D(tile_selected[0], tile_selected[1])].slice(1) != "p" && board[i_1D(movable_tiles[i][0], movable_tiles[i][1])].slice(1) == "enp";
        
        if(not_empty && !not_from_a_pawn_to_enp){
            colorNoFillCircle(BOARD_DIM[0]+INDIVIDUAL_DIM[0]*movable_tiles[i][1]+INDIVIDUAL_DIM[0]/2, BOARD_DIM[1]+INDIVIDUAL_DIM[1]*movable_tiles[i][0]+INDIVIDUAL_DIM[1]/2, 7*INDIVIDUAL_DIM[0]/16, "rgba(125,125,125,0.5)", INDIVIDUAL_DIM[0]/8)
            continue;
        }

        colorCircle(BOARD_DIM[0]+INDIVIDUAL_DIM[0]*movable_tiles[i][1]+INDIVIDUAL_DIM[0]/2, BOARD_DIM[1]+INDIVIDUAL_DIM[1]*movable_tiles[i][0]+INDIVIDUAL_DIM[1]/2, INDIVIDUAL_DIM[0]/8, "grey");
    }
}

function draw_pawn_upgrade(){
    let x = BOARD_DIM[0]+INDIVIDUAL_DIM[0]*game_ref.pawn_upgrade[1]+INDIVIDUAL_DIM[0]/2-PAWN_UPGRADE_DIM[0]/2;
    let y = BOARD_DIM[1]+INDIVIDUAL_DIM[1]*game_ref.pawn_upgrade[0]-PAWN_UPGRADE_DIM[1]-30;

    if(game_ref.pawn_upgrade[0] == 7){
        y = BOARD_DIM[1]+INDIVIDUAL_DIM[1]*game_ref.pawn_upgrade[0]+INDIVIDUAL_DIM[1]+30;
        drawFillTriangle(x+PAWN_UPGRADE_DIM[0]/2,y-20, x+PAWN_UPGRADE_DIM[0]/2-20,y, x+PAWN_UPGRADE_DIM[0]/2+20,y, "white");
    }else{
        drawFillTriangle(x+PAWN_UPGRADE_DIM[0]/2,y+PAWN_UPGRADE_DIM[1]+20, x+PAWN_UPGRADE_DIM[0]/2-20,y+PAWN_UPGRADE_DIM[1], x+PAWN_UPGRADE_DIM[0]/2+20,y+PAWN_UPGRADE_DIM[1], "white");
    }

    colorRect(x, y, PAWN_UPGRADE_DIM[0], PAWN_UPGRADE_DIM[1], "white");
    
    let upgrade_color = BLACK_UPGRADE_DATA;
    if(game_ref.white_side == 0 && game_ref.pawn_upgrade[0] == 7 || game_ref.white_side == 7 && game_ref.pawn_upgrade[0] == 0) upgrade_color = WHITE_UPGRADE_DATA;

    for (let i = 0; i < 4; i++) {
        let piece = pieces_img_data[upgrade_color[i]];

        drawImageFromSpriteSheetWithRotation(
            piece.img_src, piece.sx, piece.sy, piece.w, piece.h, x + (piece.dw+10)*i + piece.dw/2 + 10, y + PAWN_UPGRADE_DIM[1] - piece.dh/2 - 10, piece.dw, piece.dh, 0, false
        );
    }
}

function draw_game_over(){
    rematch_button.visible = true;
    colorRect(GAME_OVER_DIM[0], GAME_OVER_DIM[1], GAME_OVER_DIM[2], GAME_OVER_DIM[3], "white");
    colorNoFillRect(GAME_OVER_DIM[0]+2, GAME_OVER_DIM[1]+2, GAME_OVER_DIM[2]-4, GAME_OVER_DIM[3]-4, "black", 4);

    let game_over_text = "DRAW";
    if(game_ref.game_over == 0) game_over_text = "BLACK WINS";
    else if(game_ref.game_over == 1) game_over_text = "WHITE WINS";

    let width = measureText(game_over_text, 64, "pixel_font").width;
    drawText("rgb(18,18,18)", "64px pixel_font", game_over_text, GAME_OVER_DIM[0]+GAME_OVER_DIM[2]/2-width/2, GAME_OVER_DIM[1]+GAME_OVER_DIM[3]/2-16);
}