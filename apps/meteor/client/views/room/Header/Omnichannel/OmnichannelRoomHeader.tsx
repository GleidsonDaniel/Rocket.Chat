import { HeaderToolbox } from '@rocket.chat/ui-client';
import { useLayout, useRouter } from '@rocket.chat/ui-contexts';
import type { FC } from 'react';
import React, { useCallback, useMemo } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import BurgerMenu from '../../../../components/BurgerMenu';
import { useOmnichannelRoom } from '../../contexts/RoomContext';
import { ToolboxContext, useToolboxContext } from '../../contexts/ToolboxContext';
import type { ToolboxActionConfig } from '../../lib/Toolbox';
import RoomHeader from '../RoomHeader';
import { BackButton } from './BackButton';
import QuickActions from './QuickActions';

type OmnichannelRoomHeaderProps = {
	slots: {
		start?: unknown;
		preContent?: unknown;
		insideContent?: unknown;
		posContent?: unknown;
		end?: unknown;
		toolbox?: {
			pre?: unknown;
			content?: unknown;
			pos?: unknown;
		};
	};
};

const OmnichannelRoomHeader: FC<OmnichannelRoomHeaderProps> = ({ slots: parentSlot }) => {
	const router = useRouter();

	const currentRouteName = useSyncExternalStore(
		router.subscribeToRouteChange,
		useCallback(() => router.getRouteName(), [router]),
	);

	const { isMobile } = useLayout();
	const room = useOmnichannelRoom();
	const toolbox = useToolboxContext();

	const slots = useMemo(
		() => ({
			...parentSlot,
			start: (!!isMobile || currentRouteName === 'omnichannel-directory' || currentRouteName === 'omnichannel-current-chats') && (
				<HeaderToolbox>
					{isMobile && <BurgerMenu />}
					<BackButton routeName={currentRouteName} />
				</HeaderToolbox>
			),
			posContent: <QuickActions room={room} />,
		}),
		[isMobile, currentRouteName, parentSlot, room],
	);

	return (
		<ToolboxContext.Provider
			value={useMemo(
				() => ({
					...toolbox,
					actions: new Map([...(Array.from(toolbox.actions.entries()) as [string, ToolboxActionConfig][])]),
				}),
				[toolbox],
			)}
		>
			<RoomHeader slots={slots} room={room} />
		</ToolboxContext.Provider>
	);
};

export default OmnichannelRoomHeader;
