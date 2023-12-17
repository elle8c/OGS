/*
 * Copyright (C)  Online-Go.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { browserHistory } from "ogsHistory";
import { shouldOpenNewTab } from "misc";
import * as preferences from "preferences";

export function openUrlIfALinkWasNotClicked(ev: any, url: string) {
    if (ev.target.nodeName === "A" || ev.target.parentNode.nodeName === "A") {
        /* if a link was clicked, let the browser handle that. */
        return;
    }

    /* Only navigate on left and middle clicks */
    if (ev.button !== 0 && ev.button !== 1) {
        return;
    }

    if (shouldOpenNewTab(ev)) {
        window.open(url, "_blank");
    } else {
        browserHistory.push(url);
    }
}

export function maskedRank(rank: string): string {
    return preferences.get("hide-ranks") ? "" : rank;
}
