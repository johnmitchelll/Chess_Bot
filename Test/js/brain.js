
function Brain(hero, game){
    this.hero = hero;
    this.game = game;
    this.MAX_DEPTH = 6;

    this.get_best_move = function(){
        let best_move = this.mini_max(this.game.board.split("/"), this.game, 0, this.hero, -Infinity, Infinity);

        console.log(best_move)

    //    this.game.board = move_piece_on_board(this.game.board.split("/"), best_move.from, best_move.to, false, this.game);
    //    game_ref.turn = (game_ref.turn+1)%2;
    }

    this.mini_max = function(board, game, depth, turn, alpha, beta){

        if(depth == this.MAX_DEPTH || check_for_game_over(board, turn, game)) return this.evaluate(board);
        
        let valid_moves = [];
        let min_max_score = (turn == this.hero) ?  -Infinity : Infinity;
        let best_move;
        
        for (let i = 0; i < board.length; i++) {
            if(turn == 0 && board[i][0] == "b" || turn == 1 && board[i][0] == "w"){

                let valid_moves_for_piece = get_valid_moves(board, i_2D(i), false, game);
                if(valid_moves_for_piece.length == 0) continue;

                for (let j = 0; j < valid_moves_for_piece.length; j++) {
                    valid_moves.push({ from: i_2D(i), to: valid_moves_for_piece[j] });
                }
            }
        }

        let sorted_boards = [];

        for (let i = 0; i < valid_moves.length; i++) {
            let board_copy = deepCopy(board);
            board_copy = move_piece_on_board(board_copy, valid_moves[i].from, valid_moves[i].to, true, game);
            sorted_boards[i] = { score: this.evaluate(board_copy.split("/")), board: board_copy.split("/") };
        }

        if(turn == this.hero) sorted_boards.sort((a, b) => b.score - a.score);
        else sorted_boards.sort((a, b) => a.score - b.score);

        for (let i = 0; i < sorted_boards.length; i++) {
            if(turn == this.hero){
                min_max_score = Math.max(min_max_score, this.mini_max(sorted_boards[i].board, deepCopyObject(game), depth+1, (turn+1)%2, alpha, beta));
                if(min_max_score >= beta) break; 
                alpha = Math.max(alpha, min_max_score);
            }else{
                min_max_score = Math.min(min_max_score, this.mini_max(sorted_boards[i].board, deepCopyObject(game), depth+1, (turn+1)%2, alpha, beta));
                if(min_max_score <= alpha) break; 
                beta = Math.min(beta, min_max_score);
            }
        }

        return min_max_score;
    }

    this.evaluate = function(board){
        let score = 0;
        let color = (this.hero == 0) ? "b" : "w";

        for (let i = 0; i < board.length; i++) {
            if(board[i] == "e" || board[i].slice(1) == "enp") continue;

            if(board[i][0] == color){
                let piece_score = PIECE_SCORE[board[i].slice(1)] + PIECE_EVAL_TABLE[board[i].slice(1)][63-i];
                score += piece_score;
            } else{
                let piece_score = PIECE_SCORE[board[i].slice(1)] + PIECE_EVAL_TABLE[board[i].slice(1)][i];
                score -= piece_score;
            } 
        }

        return score;
    }
}