import random

suits = ('Hearts', 'Diamonds', 'Spades', 'Clubs')
ranks = ('Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace')
values = {'Two':2, 'Three':3, 'Four':4, 'Five':5, 'Six':6, 'Seven':7, 'Eight':8, 'Nine':9, 'Ten':10, 'Jack':10,
         'Queen':10, 'King':10, 'Ace':11}

class Card:

    def __init__(self, suit, rank):
        self.suit = suit
        self.rank = rank 

    def __str__(self):
        return f'{self.rank} of {self.suit}'

class Deck:

    def __init__(self):
        self.deck = []
        for suit in suits:
            for rank in ranks:
                self.deck.append(Card(suit, rank))

    def __str__(self):
        deck_comp = ''  # start with an empty string
        for card in self.deck:
            deck_comp += '\n '+card.__str__() # add each Card object's print string
        return 'Cards left in the deck:' + deck_comp

    def __len__(self):
        return len(self.deck)
            
    def shuffle(self):
        random.shuffle(self.deck)

# Take the first card from the deck to deal and remove from the deck.
    def deal(self):
        dealt_card = self.deck.pop(0)
        return dealt_card

class Hand:

    def __init__(self):
        self.cards = []
        self.value = 0
        self.aces = 0
    
    def add_card(self, card):
        self.cards.append(card) # add each card object to the hand
        self.value += values[card.rank] # add the value to the total
        if card.rank == 'Ace':
            self.aces += 1

    def adjust_for_ace(self):
        if self.value > 21 and self.aces > 0: # if value greater than 21 and there is an ace
            self.value -= 10 #remove 10 so it counts as 1

    def __str__(self):
        cur_hand = ''  # start with an empty string
        for card in self.cards:
            cur_hand += '\n '+card.__str__() # add each Card object's print string
        return cur_hand

class Chips:

    def __init__(self):
        self.total = 100
        self.bet = 0

    def win_bet(self):
        self.total += self.bet

    def lose_bet(self):
        self.total -= self.bet

    def __str__(self):
        return 'You have ' + str(self.total) + ' chips left for the next game.'

def take_bet(chips):
    while True:
        try:
            chips.bet = int(input("Please enter your bet: "))
        except ValueError:
            print("That is not an integer value. \n")
        else: 
            if chips.bet > chips.total:
                print(f"Your bet of {chips.bet} is greater than your available chips.")
            else:
                break

def hit(deck, hand):
    dealt_card = deck.deal()
    hand.add_card(dealt_card) # Add the card dealt to the deck
    if hand.value > 21:
        hand.adjust_for_ace()

def hit_or_stand(deck, hand):
    global playing

    while True:
        move = input("Would you like to HIT or STAND? ").lower()
        if move == 'hit':
            hit(deck, hand)
            print(hand)
            print(f' You have {hand.value} points. \n')
            if hand.value > 21:
                break
        elif move =='stand':
            print("You decided to stand. Dealer is playing.")
            playing = False
            break
        else:
            print("That is not a valid response. Please type HIT or STAND")

def show_some(player, dealer):

    print("\n Your hand: ", player)
    print('\n Dealer hand: \n [hidden] \n',dealer.cards[1],'\n')

def show_all(player, dealer): # show total value at the end of each hand
    print(" \n FINAL POINTS: ")
    print('\n Your hand: ', player)
    print('\n Dealer hand: ',dealer)
    print(f'\n You have {player.value} points. The dealer has {dealer.value} points.')


def play_again():
    while True:
        play = input("Would you like to play again? (y/n) ").lower()
        if play in 'yn':
            break
        else: print("That is not a valid response. Please type in 'y' or 'n' to continue.")
    if play == 'n':
        return False
    else: 
        return True
        
def player_busts(chips):
    print(' You busted.')
    chips.lose_bet() # player loses chips

def player_wins(chips):
    print(' You win.')
    chips.win_bet() # player wins chips 

def dealer_busts(chips):
    print(' The dealer busted. You win.')
    chips.win_bet() #player wins chips

def dealer_wins(chips):
    print(' The dealer wins.')
    chips.lose_bet() #player loses chips

def generate_new_hand():
    player_hand = Hand()
    dealer_hand = Hand()
    player_hand.add_card(deck.deal())
    player_hand.add_card(deck.deal())
    dealer_hand.add_card(deck.deal())
    dealer_hand.add_card(deck.deal())
    return player_hand, dealer_hand

# Start of gameplay
gameplay = True

# Generating deck and chips outside of while loop so that they persist from game to game
deck = Deck()
deck.shuffle()
player_chips = Chips() 

player_hand, dealer_hand = generate_new_hand()

while gameplay:
    # Print an opening statement
    print("Welcome to the blackjack table.")

    # Clear hand and generate new one for each new game
    player_hand, dealer_hand = generate_new_hand()

    # Create & shuffle the deck, deal two cards to each player
    playing = True

    # Prompt the Player for their bet

    take_bet(player_chips)
    
    # Show cards (but keep one dealer card hidden)

    show_some(player_hand, dealer_hand)

    
    while playing:
        
        # Prompt for Player to Hit or Stand
        hit_or_stand(deck, player_hand)
        
        # If player's hand exceeds 21, run player_busts() and break out of loop 
        if player_hand.value > 21:
            break

    # If Player hasn't busted, play Dealer's hand until Dealer reaches 17
    if player_hand.value <= 21:
        while dealer_hand.value <= 17:
            hit(deck, dealer_hand)

        show_all(player_hand, dealer_hand)

        # run all of the win scenarios for the player not busting
        if dealer_hand.value > 21:
            dealer_busts(player_chips)
        elif player_hand.value > dealer_hand.value:
            player_wins(player_chips)
        else:
            dealer_wins(player_chips)
    #if player has busted, run the player bust function
    else: 
        show_all(player_hand, dealer_hand)
        player_busts(player_chips)
    
    # Inform Player of their chips total 
    print('\n',player_chips,'\n')
    
    # Ask to play again
    gameplay = play_again()
