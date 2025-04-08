import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class SlotMachine {
    private JFrame frame;
    private JPanel reelPanel;
    private List<String> names;
    private boolean spinning = false;
    private Timer spinTimer;
    private int currentNameIndex = 0;
    private int spinSpeed = 100; // Speed of the spinning (milliseconds between name changes)
    
    public SlotMachine() {
        names = new ArrayList<>();
        frame = new JFrame("Slot Machine");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 300);
        frame.setLayout(new BorderLayout());
        
        reelPanel = new JPanel();
        reelPanel.setLayout(new BoxLayout(reelPanel, BoxLayout.Y_AXIS));
        reelPanel.setPreferredSize(new Dimension(300, 200));
        frame.add(reelPanel, BorderLayout.CENTER);
        
        // Adding Buttons for Spin and Stop
        JPanel buttonPanel = new JPanel();
        JButton spinButton = new JButton("🎬 Spin");
        JButton stopButton = new JButton("🛑 Stop");
        buttonPanel.add(spinButton);
        buttonPanel.add(stopButton);
        frame.add(buttonPanel, BorderLayout.SOUTH);
        
        // Add functionality to buttons
        spinButton.addActionListener(e -> startSpin());
        stopButton.addActionListener(e -> stopSpin());
        
        frame.setVisible(true);
    }

    // Function to start spinning
    public void startSpin() {
        if (spinning) return;
        spinning = true;
        currentNameIndex = 0;
        reelPanel.removeAll(); // Clear previous names
        
        spinTimer = new Timer(spinSpeed, e -> spinStep());
        spinTimer.start();
    }

    // Function to handle spinning logic
    private void spinStep() {
        if (!spinning) return;

        // Create and add a new label to simulate spinning names
        String name = names.get(new Random().nextInt(names.size()));
        JLabel nameLabel = new JLabel(name, SwingConstants.CENTER);
        nameLabel.setFont(new Font("Arial", Font.PLAIN, 24));
        reelPanel.add(nameLabel);
        reelPanel.revalidate();
        reelPanel.repaint();

        // Limit the number of names shown on screen
        if (reelPanel.getComponentCount() > 10) {
            reelPanel.remove(0); // Remove the oldest name
        }
    }

    // Function to stop spinning and show the final name
    public void stopSpin() {
        if (!spinning) return;
        spinning = false;
        
        // Stop the spin animation
        spinTimer.stop();

        // Show the final name after a brief delay
        SwingUtilities.invokeLater(() -> {
            String finalName = names.get(new Random().nextInt(names.size()));
            reelPanel.removeAll();
            JLabel finalLabel = new JLabel("🎉 " + finalName + " 🎉", SwingConstants.CENTER);
            finalLabel.setFont(new Font("Arial", Font.PLAIN, 30));
            reelPanel.add(finalLabel);
            reelPanel.revalidate();
            reelPanel.repaint();
        });
    }

    // Add names to the list (this simulates the file upload in your original JS code)
    public void addNames(List<String> namesList) {
        this.names.addAll(namesList);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            SlotMachine slotMachine = new SlotMachine();
            // Example names
            List<String> namesList = new ArrayList<>();
            namesList.add("Alice");
            namesList.add("Bob");
            namesList.add("Charlie");
            namesList.add("David");
            namesList.add("Eve");
            slotMachine.addNames(namesList);
        });
    }
}
