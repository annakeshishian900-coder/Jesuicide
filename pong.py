import pygame
pygame.init()

screen = pygame.display.set_mode((800,600))
pygame.display.set_caption("Pong")
clock = pygame.time.Clock()

left_player_score = 0
right_player_score = 0

class Button:
    def __init__(self, x, y, text, click_key, color=(255,255,255)):
        self.rect = pygame.Rect(x, y, 400, 40)
        self.text = text
        self.click_key = click_key
        self.color = color
        self.font = pygame.font.SysFont('Courier', 30, bold=True)

    def draw(self, screen):
 
            pygame.draw.rect(screen, self.color, self.rect, border_radius = 20)

            text_surface = self.font.render(self.text, True, (0, 0, 0))
            text_rect = text_surface.get_rect(center=self.rect.center)
            screen.blit(text_surface, text_rect)


    def click(self,keys):
            if keys [self.click_key]:
                ball.reset(direction=1)
                paddle_left.reset()
                paddle_right.reset()
                global left_player_score, right_player_score
                left_player_score = 0
                right_player_score = 0 

class Paddle(pygame.sprite.Sprite): #Paddle object formula
    def __init__(self, x, y, up_key, down_key, color = (255,255,255)):
        super().__init__()
        self.image = pygame.Surface((15,100))   # paddle is entire surface
        self.image.fill(color)       # white
        self.rect = self.image.get_rect(topleft=(x,y)) #paddle positioning
        self.speed = 7 #default paddle speed
        self.up_key = up_key
        self.down_key = down_key
        self.start_x = x
        self.start_y = y

#KEY INPUTS
    def update(self, keys):
        if keys[self.up_key]:
            self.rect.y -= self.speed
        if keys[self.down_key]:
            self.rect.y += self.speed
        if self.rect.y < 0: #make sure paddle doesnt go off screen
            self.rect.top = 0
        if self.rect.y > 500:
            self.rect.bottom = 600
    def reset(self):
        self.rect.topleft = (self.start_x, self.start_y)

class Ball(pygame.sprite.Sprite): #Ball object formula
    def __init__(self,x,y):
        super().__init__()
        self.image = pygame.Surface((10,10)) #surface to draw ball on
        self.image.fill((255,255,255))
        self.rect = self.image.get_rect(center=(x,y)) #positioning of surface
        self.speed_x = 4
        self.speed_y = 0.1
        self.start_x = x
        self.start_y = y

    def reset(self, direction=1):
        self.rect.center = (self.start_x, self.start_y) #positioning of surface
        self.speed_x = 4
        self.speed_y = 0.1

    def end(self):
        self.speed_x = 0
        self.speed_y= 0

    def update(self,keys):
        self.rect.y += self.speed_y
        self.rect.x += self.speed_x

        if self.rect.top <= 0:
            self.rect.top = 0
            self.speed_y *= -1
        elif self.rect.bottom >= 600:
            self.rect.bottom = 600
            self.speed_y *= -1
        
    def hit_paddle(self,paddle):
      
        self.speed_x *= -1.1
        hit_position = (ball.rect.centery - paddle.rect.centery + 1) / 50
        self.speed_y = hit_position * 3


    


ball = Ball(400,300)
paddle_left = Paddle(30,250, pygame.K_w, pygame.K_s, (255,0,0)) #red
paddle_right = Paddle(750,250, pygame.K_UP, pygame.K_DOWN, (0, 0, 255)) #blue
all_sprites = pygame.sprite.Group(paddle_left, paddle_right, ball)  # group of drawings

# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    keys = pygame.key.get_pressed()
    all_sprites.update(keys)   # update all sprites
    

    if ball.rect.left >= 800: 
        left_player_score += 1
        ball.reset(direction=-1)  # send it left
        paddle_left.reset()
        paddle_right.reset()
    elif ball.rect.right <= 0: 
        right_player_score += 1
        ball.reset(direction=1)   # send it right
        paddle_left.reset()
        paddle_right.reset()


    if ball.rect.colliderect(paddle_left.rect):
        ball.hit_paddle(paddle_left)
    elif ball.rect.colliderect(paddle_right.rect):
        ball.hit_paddle(paddle_right)


    # Fill background black
    screen.fill((0, 0, 0))

    # dotted line in center
    line_x = 396         
    segment_width = 8
    segment_height = 30
    gap = 15             

    for y in range(15, 600, segment_height + gap):
        pygame.draw.rect(screen, (255, 255, 255), (line_x, y, segment_width, segment_height))

    pygame.font.init()
    font = pygame.font.SysFont('Courier', 36, bold=True)

# Render the text
    left_score = font.render(str(left_player_score), True, (255, 255, 255)) # White text
    right_score = font.render(str(right_player_score), True, (255, 255, 255)) 
    left_win = font.render("RED WINS!", True, (255,0,0))
    right_win = font.render("BLUE WINS!", True, (0,0,255))

    left_score_rect = left_score.get_rect(center=(200, 100))
    right_score_rect = right_score.get_rect(center=(600,100))

    screen.blit(left_score, left_score_rect)
    screen.blit(right_score, right_score_rect)

    if left_player_score == 7:
        left_win_rect = left_win.get_rect(center = (200, 200))
        screen.blit(left_win, left_win_rect)
        ball.end()
        rematch_button = Button(200, 250, "Rematch? Press ENTER", pygame.K_RETURN, (152, 64, 219))
        rematch_button.draw(screen)
        rematch_button.click(keys)  


    elif right_player_score ==7:
        right_win_rect = right_win.get_rect(center = (600, 200))
        screen.blit(right_win, right_win_rect)
        ball.end()
        rematch_button = Button(200, 250, "Rematch? Press ENTER", pygame.K_RETURN, (152, 64, 219))
        rematch_button.draw(screen)
        rematch_button.click(keys) 

        

    # Draw objects
    all_sprites.draw(screen)

    # Update screen
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
