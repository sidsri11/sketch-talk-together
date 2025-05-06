
import React, { useState } from "react";
import { useDrawing } from "@/context/DrawingContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RoomJoinModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const RoomJoinModal: React.FC<RoomJoinModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { joinRoom, currentUser } = useDrawing();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId && username) {
      joinRoom(roomId, username);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleJoinRoom}>
          <DialogHeader>
            <DialogTitle>Join Drawing Room</DialogTitle>
            <DialogDescription>
              Enter a room ID and your username to join a collaborative drawing session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-id" className="text-right">
                Room ID
              </Label>
              <Input
                id="room-id"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="awesome-room-123"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your display name"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!roomId || !username}>
              Join Room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomJoinModal;
