package com.example.rentalapp;

import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.WebView;
import android.widget.RelativeLayout;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {
    private final String BaseUrl = "https://rental-expenses.vercel.app";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        WebView myWebView = findViewById(R.id.webview);
        String route = getIntent().getStringExtra("route");
        if (route != null) {
            myWebView.loadUrl(BaseUrl+route);
        } else {
            myWebView.loadUrl(BaseUrl);
        }
        myWebView.getSettings().setJavaScriptEnabled(true);
        myWebView.getSettings().setDomStorageEnabled(true);
        myWebView.getSettings().setDatabaseEnabled(true);

        RelativeLayout parentLayout = findViewById(R.id.main);
        parentLayout.setOnTouchListener((v, event) -> {
            // Check if the touch event is outside the WebView
            if (isTouchOutsideView(myWebView, event)) {
                finish(); // Close the activity
                return true;
            }
            return false;
        });
    }

    private boolean isTouchOutsideView(View view, MotionEvent event) {
        int[] location = new int[2];
        view.getLocationOnScreen(location);
        int x = location[0];
        int y = location[1];
        return event.getRawX() < x || event.getRawX() > (x + view.getWidth())
                || event.getRawY() < y || event.getRawY() > (y + view.getHeight());
    }
}
