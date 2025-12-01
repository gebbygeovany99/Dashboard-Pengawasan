import React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Modal, Box } from "@mui/material";

import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import EventIcon from "@mui/icons-material/Event";

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekOfYear);

export default function CalendarModal({ highlightedDates }) {
  const [value, setValue] = React.useState(dayjs());
  const [open, setOpen] = React.useState(false);



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <EventIcon
        onClick={() => setOpen(true)}
        sx={{ fontSize: "36px", color: "#75201d" }}
      />

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",

            // Ukuran modal mengikuti konten
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 2,
            boxShadow: 24,
            display: "inline-block",
          }}
        >
          <DateCalendar
            value={value}
            onChange={(newValue) => setValue(newValue)}
            slotProps={{
              day: ({ day }) => {
                const formatted = dayjs(day).format("YYYY-MM-DD");
                const isHighlighted = highlightedDates.includes(formatted);

                return {
                  sx: isHighlighted
                    ? {
                        backgroundColor: "#8B2320",
                        color: "white",
                        borderRadius: "50%",
                        "&:hover": { backgroundColor: "#75201d" },
                      }
                    : {},
                };
              },
            }}
          />
        </Box>
      </Modal>
    </LocalizationProvider>
  );
}
