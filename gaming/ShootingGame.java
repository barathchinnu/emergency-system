package gaming;

import gaming.core.Playable;

public class ShootingGame implements Playable {
    private String name;
    private int enemies;
    private int score;
    private boolean running;
    
    public ShootingGame(String name, int enemies) {
        this.name = name;
        this.enemies = enemies;
        this.score = 0;
    }
    
    @Override
    public void start() {
        running = true;
        System.out.println("🔫 " + name + " started!");
        System.out.println("🎯 Enemies: " + enemies);
    }
    
    @Override
    public void end() {
        running = false;
        System.out.println("🎯 Game over! Score: " + score);
    }
    
    @Override
    public void showStatus() {
        System.out.println("📊 " + name + " | Score: " + score + " | Enemies: " + enemies);
    }
    
    public void shoot() {
        if (running && enemies > 0) {
            enemies--;
            score += 100;
            System.out.println("🎯 Enemy hit! Score: " + score + " | Enemies left: " + enemies);
            if (enemies == 0) {
                end();
            }
        }
    }
}