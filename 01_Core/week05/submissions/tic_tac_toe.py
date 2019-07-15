
import random

# Creating a list of all the variables needed for every game reset
def start_game():
    game_status = True
    board = [' ']*10
    player_marks = player_input()
    player_1_mark = player_marks[0]
    player_2_mark = player_marks[1]
    active_player = choose_first()
    game_list = [board, player_1_mark, player_2_mark, active_player, game_status]
    
    return game_list

# This will control the entire game. If it's false, the program will quit
def play_again():
    play = input('Do you want to play a new game? (y/n) ')
    if play == 'y':
        return True
    else: 
        return False

# To display the board
def display_board(board): 
    print('\n'*100)
    print(' ' + board[7] + ' | ' + board[8] + ' | ' + board[9])
    print('-----------')
    print(' ' + board[4] + ' | ' + board[5] + ' | ' + board[6])
    print('-----------')
    print(' ' + board[1] + ' | ' + board[2] + ' | ' + board[3])

# To capture the player's mark choice
def player_input():
    marker = ''
    # So that we are only going to accept an 'X' or 'O', this loop will run until one of the inputs is as expected.
    while not (marker == 'X' or marker == 'O'):
        marker = input('Player 1: Will you be X or O? ').upper()

    if marker == 'X':
        return ('X', 'O')
    else:
        # If they choose 'O', player 1 is O and player 2 is X
        return ('O', 'X')

# Running a random integer to determine if player 1 or 2 is going to go first.
def choose_first():
    player = random.randint(1,2)
    first_player = 'player_'+str(player)
    return first_player

# To determine if the board is full. Incrementing the full_spots for every empty space, and if it's the full board, return false so we can add more.
# I didn't end up adding this in quiet yet, but it would be an elif after checking for the win
def full_board_check(board):
    full_spots = 0
    for spot in board:
        if not spot == ' ':
            full_spots += 1
    
    return full_spots == 9

def space_check(board, position):
    # If the string is just a space, the position is free so will return true.
    return board[position]==' '

def player_choice(board, player):
    position = 0
    active = player[-1]
    position = int(input('Please enter a number between 1-9 for your next spot: '))
    # If the board is free and the 
    if space_check(board, position) and position in [1,2,3,4,5,6,7,8,9]:
        return position

# When we've determined it's a valid position, updating the board with the new marker
def place_marker(board, marker, position):
    board[position] = marker
    return board

# Check for wins - all the different combinations of winning at the board
def win_check(board,mark):
    
    return ((board[7] == mark and board[8] == mark and board[9] == mark) or # across the top
    (board[4] == mark and board[5] == mark and board[6] == mark) or # across the middle
    (board[1] == mark and board[2] == mark and board[3] == mark) or # across the bottom
    (board[7] == mark and board[4] == mark and board[1] == mark) or # down the middle
    (board[8] == mark and board[5] == mark and board[2] == mark) or # down the middle
    (board[9] == mark and board[6] == mark and board[3] == mark) or # down the right side
    (board[7] == mark and board[5] == mark and board[3] == mark) or # diagonal
    (board[9] == mark and board[5] == mark and board[1] == mark)) # diagonal
    

    # for player1's turn

# Game Play

while play_again():
    board, player_1_mark, player_2_mark, active_player, game_status = start_game()
    
    while game_status:
        # Player 1's turn
        if active_player == 'player_1':
            display_board(board)
            print("Player 1, it's your turn.")
            position = player_choice(board, "player_1")
            board = place_marker(board, player_1_mark, position)
            #check for win, congratulate if so, otherwise change turns
            if win_check(board, player_1_mark):
                display_board(board)
                print('Congratulations, Player 1 won!')
                game_status = False
            # check to see if the board is full. If so, the game is over.
            elif full_board_check(board):
                display_board(board)
                print('The board is full, so the game is over.')
                game_status = False
            else: 
                display_board(board)
                active_player = 'player_2'
         #Player 2's turn
        else:
            display_board(board)
            print("Player 2, it's your turn.")
            position = player_choice(board, "player_2")
            board = place_marker(board, player_2_mark, position)
            #check for win, congratulate if so, otherwise change turns
            if win_check(board, player_2_mark):
                display_board(board)
                print('Congratulations, Player 2 won!')
                game_status = False
            elif full_board_check(board):
                print('The board is full, so the game is over.')
                game_status = False
            else: 
                display_board(board)
                active_player = 'player_1'