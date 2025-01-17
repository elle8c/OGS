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

import React, { useEffect, useState } from "react";

import { get } from "requests";
import * as data from "data";
import { ResponsiveLine } from "@nivo/line";

interface VoteCountPerDay {
    date: string; // assuming the date is returned as a string, e.g., "2024-03-17"
    count: number;
}

interface ModeratorVoteCountData {
    counts: VoteCountPerDay[];
    moderator_id: number;
}

interface VoteActivityGraphProps {
    vote_data: ModeratorVoteCountData;
}

function round_date(the_date: Date): Date {
    return new Date(the_date.setHours(0, 0, 0, 0));
}

const VoteActivityGraph = ({ vote_data }: VoteActivityGraphProps) => {
    const chart_data = React.useMemo(
        () => [
            {
                id: "votes",
                data:
                    vote_data?.counts.map((day) => ({
                        x: round_date(new Date(day.date)),
                        y: day.count,
                    })) ?? [],
            },
        ],
        [vote_data],
    );

    const chart_theme =
        data.get("theme") === "light" // (Accessible theme TBD - this assumes accessible is dark for now)
            ? {
                  /* nivo defaults work well with our light theme */
              }
            : {
                  text: { fill: "#FFFFFF" },
                  tooltip: { container: { color: "#111111" } },
                  grid: { line: { stroke: "#444444" } },
              };

    if (!chart_data[0].data.length) {
        return <div>No activity yet</div>;
    }

    return (
        <div className="vote-activity-graph">
            <ResponsiveLine
                data={chart_data}
                animate
                curve="monotoneX"
                enablePoints={false}
                enableSlices="x"
                axisBottom={{
                    format: "%d %b %g",
                    tickValues: "every month",
                }}
                xFormat="time:%Y-%m-%d"
                xScale={{
                    format: "%Y-%m-%d",
                    precision: "day",
                    type: "time",
                    useUTC: false,
                }}
                axisLeft={{
                    tickValues: 6,
                }}
                margin={{
                    bottom: 40,
                    left: 60,
                    right: 20,
                    top: 5,
                }}
                theme={chart_theme}
            />
        </div>
    );
};

interface UserVoteActivityGraphProps {
    user_id: number;
}

const UserVoteActivityGraph = ({ user_id }: UserVoteActivityGraphProps) => {
    const [vote_data, setVoteData] = useState<ModeratorVoteCountData | null>(null);

    // Data fetch
    useEffect(() => {
        const fetchData = async () => {
            const response = await get(`players/${user_id}/moderation?aggregate_by=day`);
            const fetchedData: ModeratorVoteCountData = await response;
            setVoteData(fetchedData);
        };

        fetchData().catch((err) => {
            console.error(err);
        });
    }, [user_id]);

    if (!vote_data) {
        return <div>Loading...</div>;
    }
    console.log("graph render", vote_data);
    return <VoteActivityGraph vote_data={vote_data} />;
};

export default UserVoteActivityGraph;
