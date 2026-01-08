package gaming.app;

import gaming.core.Playable;
import gaming.RacingGame;
import gaming.ShootingGame;
import java.util.Scanner;

public class GameApp {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("🎮 GAME CENTER");
        
        while (true) {
            System.out.println("\n1. Racing Game");
            System.out.println("2. Shooting Game"); 
            System.out.println("3. Exit");
            System.out.print("Choose: ");
            
            int choice = scanner.nextInt();
            scanner.nextLine();
            
            if (choice == 3) break;
            
            System.out.print("Game name: ");
            String name = scanner.nextLine();
            
            Playable game;
            
            if (choice == 1) {
                System.out.print("Laps: ");
                int laps = scanner.nextInt();
                game = new RacingGame(name, laps);
            } else {
                System.out.print("Enemies: ");
                int enemies = scanner.nextInt();
                game = new ShootingGame(name, enemies);
            }
            scanner.nextLine();
            

            gameSession(game, scanner);
        }
        
        System.out.println("Thanks for playing!");
        scanner.close();
    }
    
    private static void gameSession(Playable game, Scanner scanner) {
        System.out.println("\n--- GAME START ---");
        game.start();
        
        boolean playing = true;
        while (playing) {
            System.out.println("\n1. Game Action");
            System.out.println("2. Show Status");
            System.out.println("3. End Game");
            System.out.println("4. Back to Menu");
            System.out.print("Choose: ");
            
            int action = scanner.nextInt();
            scanner.nextLine();
            
            switch (action) {
                case 1:
                    if (game instanceof RacingGame) {
                        ((RacingGame) game).nextLap();
                    } else {
                        ((ShootingGame) game).shoot();
                    }
                    break;
                case 2:
                    game.showStatus();
                    break;
                case 3:
                    game.end();
                    break;
                case 4:
                    playing = false;
                    break;
            }
        }
        System.out.println("--- GAME END ---\n");
    }
}