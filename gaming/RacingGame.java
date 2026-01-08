package gaming;

import gaming.core.Playable;

public class RacingGame implements Playable {
    private String name;
    private int laps;
    private int position;
    private boolean running;
    
    public RacingGame(String name, int laps) {
        this.name = name;
        this.laps = laps;
        this.position = 1;
    }
    
    @Override
    public void start() {
        running = true;
        System.out.println("🏁 " + name + " started!");
        System.out.println("🚗 Position: " + position);
    }
    
    @Override
    public void end() {
        running = false;
        System.out.println("🎯 Race finished! Final position: " + position);
    }
    
    @Override
    public void showStatus() {
        System.out.println("📊 " + name + " | Position: " + position + " | Running: " + running);
    }
    
    public void nextLap() {
        if (running) {
            position += (int)(Math.random() * 3) - 1;
            position = Math.max(1, Math.min(8, position));
            System.out.println("📈 Lap completed! Position: " + position);
        }
    }
}