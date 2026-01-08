"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { GameResultPopup } from "@/shared/components/GameResultPopup";

export const POPUP_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type PopupType = (typeof POPUP_TYPE)[keyof typeof POPUP_TYPE];

export interface PopupData {
  resultAmount?: number;
  message?: string;
  type?: PopupType;
  autoCloseDelay?: number;
  onClose?: () => void;
}

interface PopupContextProps {
  showPopup: (data: PopupData) => void;
  hidePopup: () => void;
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) throw new Error("usePopup must be used within PopupProvider");
  return context;
};

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [popupData, setPopupData] = useState<PopupData | null>(null);

  const showPopup = (data: PopupData) => setPopupData(data);
  const hidePopup = () => setPopupData(null);

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popupData && <GameResultPopup {...popupData} onClose={hidePopup} />}
    </PopupContext.Provider>
  );
};
