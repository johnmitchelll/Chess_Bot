
function Brain(hero, game){
    this.hero = hero;
    this.game = game;
    this.MAX_DEPTH = 4;

    this.get_best_move = function(){
        console.log(this.mini_max(this.game.board.split("/"), this.MAX_DEPTH, this.hero));
    }

    this.mini_max = function(board, depth, turn, alpha, beta){

        if(depth == 0) return this.evaluate(board);
        
        let valid_moves = [];
        let scores = [];
        
        for (let i = 0; i < board.length; i++) {
            if(turn == 0 && board[i][0] == "b" || turn == 1 && board[i][0] == "w"){
                let move = { from: i_2D(i), to: get_valid_moves(board, i_2D(i), false, this.game) };

                if(move.to.length > 0) valid_moves.push(move);
            }
        }

        for (let i = 0; i < valid_moves.length; i++) {
            for (let j = 0; j < valid_moves[i].to.length; j++) {
                let board_copy = deepCopy(board);
                
                board_copy = move_piece_on_board(board_copy, valid_moves[i].from, valid_moves[i].to[j], true, this.game);

                let move_score = { score: this.mini_max(board_copy.split("/"), depth-1, (turn+1)%2), from: valid_moves[i].from, to: valid_moves[i].to[j] };
                scores.push(move_score);
            }
        }

        if(turn != this.hero) scores.sort((a, b) => a.score - b.score);
        else scores.sort((a, b) => b.score - a.score);

        return scores[0].score;
    }

    this.evaluate = function(board){
        let score = 0;
        let color = (this.hero == 0) ? "b" : "w";

        for (let i = 0; i < board.length; i++) {
            if(board[i] == "e" || board[i] == "enp") continue;

            if(board[i][0] == color) score += PIECE_SCORE[board[i].slice(1)];
            else score -= PIECE_SCORE[board[i].slice(1)];
        }

        return score;
    }
}