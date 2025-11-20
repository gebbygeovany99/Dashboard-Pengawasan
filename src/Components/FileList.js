// FileList.jsx
import { Box, Typography, IconButton, Chip } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function FileList({ files, onRemove }) {
  if (!files || files.length === 0) return null;

  // format size file
  const formatSize = (size) => {
    if (size > 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(1) + " MB";
    }
    return (size / 1024).toFixed(1) + " KB";
  };

  const getExtension = (name) => {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "";
  };

  return (
    <Box sx={{ 
        mt: 4,
        textAlign: "left",
        // width: '50%',
        // justifySelf: 'center',
    }}>
      <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
        File yang dipilih:
      </Typography>
      <Box sx={{
        // style untuk scrollable
        maxHeight: '40vh',          
        overflowY: "auto",
        pr: 1,                   // supaya scroll tidak nutup teks
      }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {files.map((file, idx) => {
            const ext = getExtension(file.name);

            return (
                <Box
                key={`${file.name}-${idx}`}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid #F0D7D6",
                    backgroundColor: "#FFF9F8",
                }}
                >
                {/* kiri */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        backgroundColor: "#FDE4E2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    >
                    <InsertDriveFileIcon sx={{ fontSize: 20, color: "#992F2C" }} />
                    </Box>

                    <Box>
                    <Typography
                        variant="body2"
                        sx={{
                        fontWeight: 600,
                        maxWidth: 260,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        }}
                    >
                        {file.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {formatSize(file.size)}
                    </Typography>
                    </Box>

                    {ext && (
                    <Chip
                        label={ext}
                        size="small"
                        sx={{
                        ml: 1,
                        fontSize: "0.7rem",
                        backgroundColor: "#FFF",
                        border: "1px solid #F0D7D6",
                        }}
                    />
                    )}
                </Box>

                {/* kanan (remove) */}
                <IconButton
                    size="small"
                    onClick={() => onRemove(idx)}
                    sx={{
                    color: "#992F2C",
                    "&:hover": { backgroundColor: "#FDE4E2" },
                    }}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
                </Box>
            );
            })}
        </Box>
        </Box>
      
    </Box>
  );
}
