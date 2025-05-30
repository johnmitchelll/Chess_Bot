

function init_menu_items(){
    rematch_button = new Button(GAME_OVER_DIM[0]+GAME_OVER_DIM[2]/2, GAME_OVER_DIM[1]+GAME_OVER_DIM[3]-50, "REMATCH", false, () => {
        if(game_ref.white_side == 0){
            game_ref.board = extend_compressed_board_string(HERO_WHITE_STARTING_BOARD);
            game_ref.white_side = 7;
            game_ref.black_side = 0;
        }else{
            game_ref.board = extend_compressed_board_string(HERO_BLACK_STARTING_BOARD);
            game_ref.white_side = 0;
            game_ref.black_side = 7;
        }

        game_ref.king_in_check = false;
        game_ref.turn = 1;
        game_ref.pawn_upgrade = [-1, -1];
        game_ref.game_over = -1;
        rematch_button.visible = false;
        game_history = new History();
    });

    buttons.push(rematch_button);
}