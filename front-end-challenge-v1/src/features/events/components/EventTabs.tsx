"use client";

import { Badge, Box, Tab, Tabs } from "@mui/material";

export type EventTabValue = "upcoming" | "past";

interface EventTabsProps {
  value: EventTabValue;
  onChange: (value: EventTabValue) => void;
  upcomingCount: number;
  pastCount: number;
}

export function EventTabs({
  value,
  onChange,
  upcomingCount,
  pastCount,
}: EventTabsProps) {
  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: EventTabValue,
  ) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Event tabs"
        variant="fullWidth"
      >
        <Tab
          label={
            <Badge badgeContent={upcomingCount} color="primary" max={99}>
              <Box sx={{ pr: upcomingCount > 0 ? 2 : 0 }}>Upcoming Events</Box>
            </Badge>
          }
          value="upcoming"
          id="event-tab-upcoming"
          aria-controls="event-tabpanel-upcoming"
        />
        <Tab
          label={
            <Badge badgeContent={pastCount} color="default" max={99}>
              <Box sx={{ pr: pastCount > 0 ? 2 : 0 }}>Past Events</Box>
            </Badge>
          }
          value="past"
          id="event-tab-past"
          aria-controls="event-tabpanel-past"
        />
      </Tabs>
    </Box>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: EventTabValue;
  currentValue: EventTabValue;
}

export function EventTabPanel({
  children,
  value,
  currentValue,
}: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== currentValue}
      id={`event-tabpanel-${value}`}
      aria-labelledby={`event-tab-${value}`}
    >
      {value === currentValue && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}
