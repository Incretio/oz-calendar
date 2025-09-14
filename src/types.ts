import { TFile } from 'obsidian';

export type OZNote = {
	type: 'note';
	displayName: string;
	path: string;
};

export type OZReminder = {
	type: 'task' | 'periodic';
	displayName: string;
	date: string;
};

type OZItem = OZNote | OZReminder;

export interface OZCalendarDaysMap {
	[key: string]: OZItem[];
}

export type DayChangeCommandAction = 'next-day' | 'previous-day' | 'today';

export const fileToOZItem = (params: { note: TFile }): OZItem => {
	return {
		type: 'note',
		displayName: params.note.basename,
		path: params.note.path,
	};
};

export const hashtagToOZItem = (params: { note: TFile; hashtagText: string; hashtagMatch: string }): OZItem => {
	// Extract text after hashtag: #event/2025/09/14 Купить хлеба -> "Купить хлеба"
	// Find the position of the hashtag match in the line
	const hashtagIndex = params.hashtagText.indexOf(params.hashtagMatch);
	if (hashtagIndex === -1) {
		// Fallback if hashtag not found in text
		return {
			type: 'note',
			displayName: params.note.basename,
			path: params.note.path,
		};
	}
	
	// Extract text after the hashtag match
	const textAfterHashtag = params.hashtagText.substring(hashtagIndex + params.hashtagMatch.length).trim();
	// Remove leading dash and spaces if present (for markdown list items)
	const cleanText = textAfterHashtag.replace(/^-\s*/, '').trim();
	
	let displayName;
	if (cleanText) {
		// Create a link to the hashtag within the file
		displayName = `[[${params.note.basename}#${params.hashtagMatch}|${cleanText}]]`;
	} else {
		// Fallback to file link if no text after hashtag
		displayName = `[[${params.note.basename}]]`;
	}
	
	return {
		type: 'note',
		displayName: displayName,
		path: params.note.path,
	};
};
