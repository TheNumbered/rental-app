package com.example.rentalapp;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

public class MenuWidget extends AppWidgetProvider {

    private static final String MANAGE_TENANT_ROUTE = "/manage-tenant";
    private static final String ADD_EXPENSE_ROUTE = "/add-expense";

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Construct the RemoteViews object
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.menu_widget);

        // Set up the Manage Tenant button
        Intent manageTenantIntent = new Intent(context, MainActivity.class);
        manageTenantIntent.putExtra("route", MANAGE_TENANT_ROUTE);
        PendingIntent manageTenantPendingIntent = PendingIntent.getActivity(context, 1, manageTenantIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.manageTenant, manageTenantPendingIntent);

        // Set up the Add Expense button
        Intent addExpenseIntent = new Intent(context, MainActivity.class);
        addExpenseIntent.putExtra("route", ADD_EXPENSE_ROUTE);
        PendingIntent addExpensePendingIntent = PendingIntent.getActivity(context, 2, addExpenseIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.addExpense, addExpensePendingIntent);

        // Set up the History button
        Intent historyIntent = new Intent(context, MainActivity.class);
        historyIntent.putExtra("route", "/history");
        PendingIntent historyPendingIntent = PendingIntent.getActivity(context, 3, historyIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.history, historyPendingIntent);

        // Instruct the widget manager to update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}
