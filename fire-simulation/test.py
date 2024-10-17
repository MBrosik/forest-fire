from simulation.forest_map import ForestMap


def main():
    val = ForestMap.from_conf("configurations/test_conf.json")

    for i in val.sectors:
        for j in i:
            print(j.sector_id)


if __name__ == '__main__':
    main()