import React from "react";
import { View } from "react-native";
import AFG from "./files/AFG.svg";
import ARE from "./files/ARE.svg";
import BGD from "./files/BGD.svg";
import BHR from "./files/BHR.svg";
import BRN from "./files/BRN.svg";
import BTN from "./files/BTN.svg";
import CHN from "./files/CHN.svg";
import IDN from "./files/IDN.svg";
import IND from "./files/IND.svg";
import IRN from "./files/IRN.svg";
import IRQ from "./files/IRQ.svg";
import JOR from "./files/JOR.svg";
import JPN from "./files/JPN.svg";
import KAZ from "./files/KAZ.svg";
import KGZ from "./files/KGZ.svg";
import KHM from "./files/KHM.svg";
import KOR from "./files/KOR.svg";
import SAU from "./files/SAU.svg";
import KWT from "./files/KWT.svg";
import LAO from "./files/LAO.svg";
import LKA from "./files/LKA.svg";
import MDV from "./files/MDV.svg";
import MMR from "./files/MMR.svg";
import MNG from "./files/MNG.svg";
import MYS from "./files/MYS.svg";
import NPL from "./files/NPL.svg";
import OMN from "./files/OMN.svg";
import PHL from "./files/PHL.svg";
import PAK from "./files/PAK.svg";
import PRK from "./files/PRK.svg";
import PSE from "./files/PSE.svg";
import SGP from "./files/SGP.svg";
import SYR from "./files/SYR.svg";
import THA from "./files/THA.svg";
import TJK from "./files/TJK.svg";
import TKM from "./files/TKM.svg";
import TLS from "./files/TLS.svg";
import TWN from "./files/TWN.svg";
import UZB from "./files/UZB.svg";
import VNM from "./files/VNM.svg";
import YEM from "./files/YEM.svg";
import HKG from "./files/HKG.svg";
import MAC from "./files/MAC.svg";

const FlagComponent = {
	AFG: <AFG width="50" height="25" />,
	ARE: <ARE width="50" height="25" />,
	BGD: <BGD width="50" height="25" />,
	BHR: <BHR width="50" height="25" />,
	BRN: <BRN width="50" height="25" />,
	BTN: <BTN width="50" height="25" />,
	CHN: <CHN width="50" height="25" />,
	IDN: <IDN width="50" height="25" />,
	IND: <IND width="50" height="25" />,
	IRN: <IRN width="50" height="25" />,
	IRQ: <IRQ width="50" height="25" />,
	JOR: <JOR width="50" height="25" />,
	JPN: <JPN width="50" height="25" />,
	KAZ: <KAZ width="50" height="25" />,
	KGZ: <KGZ width="50" height="25" />,
	KHM: <KHM width="50" height="25" />,
	KOR: <KOR width="50" height="25" />,
	SAU: <SAU width="50" height="25" />,
	KWT: <KWT width="50" height="25" />,
	LAO: <LAO width="50" height="25" />,
	LKA: <LKA width="50" height="25" />,
	MDV: <MDV width="50" height="25" />,
	MMR: <MMR width="50" height="25" />,
	MNG: <MNG width="50" height="25" />,
	MYS: <MYS width="50" height="25" />,
	NPL: <NPL width="50" height="25" />,
	OMN: <OMN width="50" height="25" />,
	PHL: <PHL width="50" height="25" />,
	PAK: <PAK width="50" height="25" />,
	PRK: <PRK width="50" height="25" />,
	PSE: <PSE width="50" height="25" />,
	SGP: <SGP width="50" height="25" />,
	SYR: <SYR width="50" height="25" />,
	THA: <THA width="50" height="25" />,
	TJK: <TJK width="50" height="25" />,
	TKM: <TKM width="50" height="25" />,
	TLS: <TLS width="50" height="25" />,
	TWN: <TWN width="50" height="25" />,
	UZB: <UZB width="50" height="25" />,
	VNM: <VNM width="50" height="25" />,
	YEM: <YEM width="50" height="25" />,
	HKG: <HKG width="50" height="25" />,
	MAC: <MAC width="50" height="25" />,
};

export default function Flag({ countryid }) {
	return <View>{FlagComponent[`${countryid}`]}</View>;
}
