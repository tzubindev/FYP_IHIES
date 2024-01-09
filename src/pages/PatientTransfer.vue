<template>
    <!-- TRANSLATION -->
    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <AccessDenied v-if="is_access_denied"></AccessDenied>

        <Loader
            :loading="!(is_verified && is_initiated) && !is_access_denied"
            class="w-4/5 z-30 absolute"
            v-if="!(is_verified && is_initiated) && !is_access_denied"
        ></Loader>

        <!-- Manage bed modal -->
        <div v-if="is_manage_bed_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
            ></div>
            <div
                class="bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <div class="font-bold w-full text-center">
                    {{ $t("manage_bed") }}
                </div>

                <div class="my-2 grid grid-cols-2 gap-2 w-full px-8">
                    <div
                        class="cursor-pointer hover:bg-cool transition bg-blue w-full h-full flex justify-center items-center p-8 text-white"
                        v-if="!manage_bed"
                        @click="manage_bed = 'add'"
                    >
                        {{ $t("add_bed") }}
                    </div>
                    <div
                        class="cursor-pointer hover:bg-darkred transition bg-red w-full h-full flex justify-center items-center p-8 text-white"
                        v-if="!manage_bed"
                        @click="manage_bed = 'remove'"
                    >
                        {{ $t("remove_bed") }}
                    </div>
                </div>
                <div v-if="manage_bed === 'add'" class="w-full my-2">
                    <div>{{ $t("number_of_beds") }}</div>
                    <input
                        type="number"
                        v-model="added_bed_no"
                        class="w-full bg-transparent border-b border-gray/50 focus:outline-none p-2 text-center"
                    />
                </div>

                <div v-if="manage_bed === 'remove'" class="w-full my-2">
                    <div>{{ $t("remove_beds") }}</div>
                    <select
                        multiple
                        name="removed_beds"
                        id="removed_beds"
                        v-model="removed_beds"
                        class="w-full bg-transparent text-center border p-2 max-h-[200px] overflow-y-auto border-gray/50 cursor-pointer focus:outline-none"
                    >
                        <option
                            v-for="d in ane_beds"
                            :key="d.id"
                            :value="d.id"
                            class="p-2 flex border-b border-gray/30"
                        >
                            {{ $t("bed_no") }} :
                            {{ d.id }}
                        </option>
                    </select>
                </div>

                <div class="w-full flex justify-end mt-2">
                    <div
                        class="bg-green p-2 py-1 text-gray shadow shadow-gray cursor-pointer transition hover:bg-darkgreen"
                        @click="closeManageBedModal"
                    >
                        {{ $t("confirm") }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Transferring Info Modal -->
        <div v-if="is_transferring_info_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
                @click="closeTransferringInfo"
            ></div>
            <div
                class="text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 w-full max-w-[400px]"
            >
                <div
                    class="grid grid-cols-2 gap-4 w-full bg-white/90 p-8 max-h-[400px] overflow-y-auto"
                >
                    <div
                        v-for="displayKey in Object.keys(selected_request)"
                        :key="displayKey"
                        class="text-[12px] flex flex-wrap"
                    >
                        <div class="w-full font-bold">
                            {{ $t(displayKey) }}
                        </div>
                        <div
                            v-if="displayKey.split('_')[1] === 'timestamp'"
                            class="text-gray/80"
                        >
                            {{
                                formatDateTime(
                                    selected_request[displayKey],
                                    true
                                )
                            }}
                        </div>
                        <div
                            v-else-if="
                                displayKey === 'from_institution_id' ||
                                displayKey === 'to_institution_id'
                            "
                            class="text-gray/80"
                        >
                            {{
                                institutions[selected_request[displayKey] - 1]
                                    .name
                            }}
                        </div>

                        <div v-else class="text-gray/80">
                            {{
                                selected_request[displayKey] === 1 ||
                                selected_request[displayKey] === 0
                                    ? Boolean(selected_request[displayKey])
                                    : selected_request[displayKey]
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Place Patient Modal -->
        <div v-if="is_place_patient_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
            ></div>
            <div
                class="bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <form class="w-full">
                    <!-- Title -->
                    <div class="font-bold w-full text-center">
                        {{ $t("place_patient") }}
                    </div>

                    <!-- Form body -->
                    <div class="my-4 w-full">
                        <div class="w-full font-bold text-left">
                            {{ $t("patient") }}
                        </div>

                        <div
                            v-if="profile_picture_url"
                            class="p-4 flex justify-center items-center flex-wrap"
                        >
                            <img
                                src="../assets/img_loading.gif"
                                class="w-[64px] h-[64px]"
                                v-if="profile_picture_url == 'loading'"
                            />
                            <div
                                class="w-full text-center text-gray/80 animate-pulse"
                                v-if="profile_picture_url == 'loading'"
                            >
                                {{ $t("loading_profile_picture") }}
                            </div>
                            <img
                                :src="profile_picture_url"
                                v-if="profile_picture_url != 'loading'"
                            />
                        </div>

                        <input
                            list="patient_id"
                            v-model="placed_patient"
                            class="w-full text-center p-2 bg-transparent focus:outline-none border-b border-gray/50 cursor-pointer"
                        />
                        <datalist id="patient_id" name="patient_id">
                            <option
                                v-for="p in patients"
                                :key="p"
                                :value="'[' + p.id + '] ' + p.name"
                            ></option>
                        </datalist>
                    </div>

                    <!-- Buttons -->
                    <div
                        class="w-full flex justify-end mt-2 items-center gap-2"
                    >
                        <div
                            class="p-2 py-1 cursor-pointer transition hover:text-red hover:underline"
                            @click="closePlacePatientModal"
                        >
                            {{ $t("cancel") }}
                        </div>
                        <button
                            class="bg-red p-2 py-1 text-white cursor-pointer transition hover:bg-darkred"
                            @click.prevent="handlePlacePatient"
                            type="button"
                            v-if="
                                profile_picture_url &&
                                profile_picture_url != 'loading'
                            "
                        >
                            {{ $t("confirm") }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Complete Transfer Modal -->
        <div v-if="is_complete_transfer_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
            ></div>
            <div
                class="bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <form class="w-full">
                    <!-- Title -->
                    <div class="font-bold w-full text-center">
                        {{ $t("place_patient_to_reserved_bed") }}
                    </div>

                    <!-- Form body -->
                    <div class="my-4 w-full">
                        <div class="w-full font-bold text-left">
                            {{ $t("patient") }}
                        </div>

                        <input
                            list="patient_id"
                            v-model="placed_patient"
                            class="w-full text-center p-2 bg-transparent focus:outline-none border-b border-gray/50 cursor-pointer"
                        />
                        <datalist id="patient_id" name="patient_id">
                            <option
                                v-for="p in transferring"
                                :key="p"
                                :value="p.patient_id"
                            ></option>
                        </datalist>
                    </div>

                    <!-- Buttons -->
                    <div
                        class="w-full flex justify-end mt-2 items-center gap-2"
                    >
                        <div
                            class="p-2 py-1 cursor-pointer transition hover:text-red hover:underline"
                            @click="closeCompleteTransferModal"
                        >
                            {{ $t("cancel") }}
                        </div>
                        <button
                            class="bg-red p-2 py-1 text-white cursor-pointer transition hover:bg-darkred"
                            @click.prevent="handleArrivedTransferringPatient"
                            type="button"
                            v-if="placed_patient"
                        >
                            {{ $t("confirm") }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Request Transfer Modal -->
        <div v-if="is_request_transfer_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
            ></div>
            <div
                class="max-h-[600px] overflow-y-auto bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <form class="w-full">
                    <!-- Title -->
                    <div class="font-bold w-full text-center">
                        {{ $t("new_transfer_request") }}
                    </div>

                    <!-- Form body -->
                    <div class="my-4 w-full">
                        <!-- Patient selection -->
                        <div class="w-full font-bold text-left">
                            {{ $t("patient") }}
                        </div>
                        <div
                            v-if="profile_picture_url"
                            class="p-4 flex justify-center items-center flex-wrap"
                        >
                            <img
                                src="../assets/img_loading.gif"
                                class="w-[64px] h-[64px]"
                                v-if="profile_picture_url == 'loading'"
                            />
                            <div
                                class="w-full text-center text-gray/80 animate-pulse"
                                v-if="profile_picture_url == 'loading'"
                            >
                                {{ $t("loading_profile_picture") }}
                            </div>
                            <img
                                :src="profile_picture_url"
                                v-if="profile_picture_url != 'loading'"
                            />
                        </div>
                        <input
                            list="patient_id"
                            v-model="placed_patient"
                            class="w-full text-center p-2 bg-transparent focus:outline-none border-b border-gray/50 cursor-pointer"
                        />
                        <datalist id="patient_id" name="patient_id">
                            <option
                                v-for="p in patients"
                                :key="p"
                                :value="'[' + p.id + '] ' + p.name"
                            ></option>
                        </datalist>
                        <!-- Reason -->
                        <div class="w-full font-bold text-left mt-3">
                            {{ $t("reason") }}
                        </div>
                        <input
                            class="focus:outline-none p-2 text-center w-full bg-transparent border-b border-gray/50"
                            type="text"
                            v-model="new_request.reason"
                            maxlength="255"
                        />

                        <!-- Current condition -->
                        <div class="w-full font-bold text-left mt-3">
                            {{ $t("current_condition") }}
                        </div>
                        <input
                            class="focus:outline-none p-2 text-center w-full bg-transparent border-b border-gray/50"
                            type="text"
                            v-model="new_request.current_condition"
                            maxlength="255"
                        />

                        <!-- Note -->
                        <div class="w-full font-bold text-left mt-3">
                            {{ $t("note") }}
                        </div>
                        <textarea
                            class="focus:outline-none p-2 w-full bg-transparent border-b border-gray/50"
                            v-model="new_request.note"
                        ></textarea>
                    </div>

                    <!-- Buttons -->
                    <div
                        class="w-full flex justify-end mt-2 items-center gap-2"
                        v-if="
                            profile_picture_url &&
                            profile_picture_url != 'loading'
                        "
                    >
                        <div
                            class="p-2 py-1 cursor-pointer transition hover:text-red hover:underline"
                            @click="closeRequestTrasferModal"
                        >
                            {{ $t("cancel") }}
                        </div>
                        <button
                            class="bg-red p-2 py-1 text-white cursor-pointer transition hover:bg-darkred"
                            @click.prevent="handleRequestTransfer"
                            type="button"
                        >
                            {{ $t("confirm") }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Main Panel -->
        <div
            v-if="is_verified && is_initiated"
            class="h-screen w-full flex flex-wrap overflow-y-auto"
        >
            <!-- Sidebar -->
            <Sidebar
                :username="this.user.name"
                medicalPersonnel
                @toggled="updateSidebarExpansion"
            ></Sidebar>

            <!-- Topbar -->
            <Topbar></Topbar>

            <!-- Schedule slot -->
            <div
                class="w-full h-full"
                :class="{
                    'pl-[180px]': is_sidebar_expanding,
                    'pl-[60px]': !is_sidebar_expanding,
                }"
            >
                <div class="pt-6 pb-8 px-10 w-full h-fit">
                    <!-- Path showing -->
                    <div
                        class="h-[40px] w-full font-extrabold p-2 text-xs flex justify-center"
                    >
                        <div
                            class="w-full max-w-[950px] flex items-center justify-start"
                        >
                            <p>{{ $t("healthie") }}</p>
                            <p class="mx-1.5">&gt;</p>
                            <p>{{ $t("patient_transfer") }}</p>
                        </div>
                    </div>

                    <div class="flex justify-center w-full">
                        <div
                            class="w-full grid grid-cols-1 lg:grid-cols-3 lg:max-w-[1100px]"
                        >
                            <!-- Viewers -->
                            <div class="lg:col-span-2 text-[14px] pr-4">
                                <!-- Summary -->
                                <div class="w-full grid grid-cols-3 gap-2">
                                    <div
                                        class="flex items-center justify-between p-2 bg-gradient-to-br from-mintage to-darkgreen text-white"
                                    >
                                        <div
                                            class="bg-white/40 w-fit p-1backdrop-blur-xl"
                                        >
                                            <img
                                                src="../assets/bed.svg"
                                                class="w-5 h-5"
                                            />
                                        </div>
                                        <p>{{ $t("available_beds") }}</p>

                                        <div class="text-[26px] pr-2">
                                            {{
                                                ane_beds.filter(
                                                    (b) =>
                                                        b.is_resolved &&
                                                        !b.is_reserved
                                                ).length
                                            }}
                                        </div>
                                    </div>
                                    <div
                                        class="flex items-center justify-between p-2 bg-gradient-to-br from-red to-darkred text-white"
                                    >
                                        <div
                                            class="bg-white/40 w-fit p-1 backdrop-blur-xl"
                                        >
                                            <img
                                                src="../assets/transfer.svg"
                                                class="w-5 h-5"
                                            />
                                        </div>
                                        <p>{{ $t("transferring") }}</p>

                                        <div class="text-[26px] pr-2">
                                            {{ this.transferring.length }}
                                        </div>
                                    </div>
                                    <div
                                        class="flex items-center justify-between p-2 bg-gradient-to-br from-blue to-cool text-white"
                                    >
                                        <div
                                            class="bg-white/40 w-fit p-1 backdrop-blur-xl"
                                        >
                                            <img
                                                src="../assets/completed.svg"
                                                class="w-5 h-5"
                                            />
                                        </div>
                                        <p>{{ $t("requested") }}</p>

                                        <div class="text-[26px] pr-2">
                                            {{ requested.length }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Viewer Tab -->
                                <div
                                    class="w-full border-b border-gray/30 mt-3 flex"
                                >
                                    <!-- Tabs -->
                                    <div
                                        class="w-fit transition cursor-pointer hover:bg-gray/10 p-2"
                                        :class="{
                                            'border-b-4 border-red':
                                                selected_tab === 0,
                                        }"
                                        @click="selected_tab = 0"
                                    >
                                        {{ $t("available_beds") }}
                                    </div>
                                    <div
                                        class="w-fit transition cursor-pointer hover:bg-gray/10 p-2"
                                        :class="{
                                            'border-b-4 border-red':
                                                selected_tab === 1,
                                        }"
                                        @click="selected_tab = 1"
                                    >
                                        {{ $t("transferring") }}
                                    </div>
                                    <div
                                        class="w-fit transition cursor-pointer hover:bg-gray/10 p-2"
                                        :class="{
                                            'border-b-4 border-red':
                                                selected_tab === 2,
                                        }"
                                        @click="selected_tab = 2"
                                    >
                                        {{ $t("requested") }}
                                    </div>
                                </div>

                                <!--Viewer Body-->
                                <!-- is_resolved beds -->
                                <Transition>
                                    <div v-if="selected_tab === 0" class="p-3">
                                        <!-- Manage bed button -->
                                        <div class="w-full flex justify-end">
                                            <div
                                                class="shadow shadow-gray cursor-pointer hover:bg-gray transition p-1 pl-1 pr-2 bg-cool text-white flex items-center gap-1"
                                                @click="openManageBedModal"
                                            >
                                                <img
                                                    src="../assets/add.svg"
                                                    class="w-5 h-5"
                                                />
                                                <div>
                                                    {{ $t("manage_bed") }}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Info blocks -->
                                        <div
                                            class="overflow-y-auto max-h-[500px] p-0.5 mt-3"
                                        >
                                            <div
                                                class="mb-2 shadow shadow-gray p-2 py-2 grid grid-cols-4"
                                                v-for="(bed, index) in ane_beds"
                                                :key="index"
                                                :class="{
                                                    'bg-red text-white':
                                                        !bed.is_resolved,
                                                    'bg-green':
                                                        bed.is_resolved &&
                                                        !bed.is_reserved,
                                                    'bg-yellow':
                                                        bed.is_reserved,
                                                }"
                                            >
                                                <!-- Bed info -->

                                                <div
                                                    class="flex items-center gap-2"
                                                >
                                                    <div
                                                        class="bg-gray text-white p-1 px-2"
                                                    >
                                                        {{ $t("bed_no") }}
                                                    </div>
                                                    {{ bed.id }}
                                                </div>

                                                <div
                                                    class="flex items-center gap-2 col-span-2"
                                                >
                                                    <div
                                                        class="bg-gray text-white p-1 px-2"
                                                        v-if="!bed.is_resolved"
                                                    >
                                                        {{ $t("patient_id") }}
                                                    </div>
                                                    {{ bed.patient_id }}
                                                </div>

                                                <!-- Update bed info buttons -->
                                                <div class="text-center">
                                                    <div
                                                        v-if="
                                                            bed.is_resolved &&
                                                            !bed.is_reserved
                                                        "
                                                    >
                                                        <div
                                                            class="bg-darkgreen p-2 py-1 text-white shadow shadow-gray cursor-pointer hover:bg-mintage/80 transition"
                                                            @click="
                                                                placePatient(
                                                                    bed.id
                                                                )
                                                            "
                                                        >
                                                            {{
                                                                $t(
                                                                    "place_patient"
                                                                )
                                                            }}
                                                        </div>
                                                    </div>
                                                    <div
                                                        v-else-if="
                                                            bed.is_resolved &&
                                                            bed.is_reserved
                                                        "
                                                    >
                                                        <div
                                                            class="bg-darkyellow p-2 py-1 text-white shadow shadow-gray cursor-pointer hover:bg-darkyellow/80 transition"
                                                            @click="
                                                                completeTransfer(
                                                                    bed.id
                                                                )
                                                            "
                                                        >
                                                            {{
                                                                $t(
                                                                    "patient_arrived"
                                                                )
                                                            }}
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        <div
                                                            class="bg-gray p-2 py-1 text-white shadow shadow-gray cursor-pointer hover:bg-gray/80 transition"
                                                            @click="
                                                                resolveBed(
                                                                    bed.id
                                                                )
                                                            "
                                                        >
                                                            {{ $t("resolved") }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>

                                <!-- Transferring -->
                                <Transition>
                                    <div
                                        v-if="selected_tab === 1"
                                        class="p-3 flex flex-wrap max-h-[500px] overflow-y-auto"
                                    >
                                        <!-- Headers -->
                                        <div
                                            class="grid grid-cols-5 w-full text-white text-center"
                                        >
                                            <div
                                                v-for="(
                                                    h, index
                                                ) in transferring_headers"
                                                :key="index"
                                                class="w-full bg-gray py-1"
                                            >
                                                <div
                                                    :class="{
                                                        'border-r border-white/50':
                                                            index !==
                                                            transferring_headers.length -
                                                                1,
                                                    }"
                                                >
                                                    {{ $t(h) }}
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Body -->
                                        <div
                                            v-for="(t, index) in transferring"
                                            :key="index"
                                            class="p-2 cursor-pointer hover:bg-gray/20 transition w-full bg-gray/5 border-x border-b border-gray/50 grid grid-cols-5"
                                            @click="openTransferringInfo(t)"
                                        >
                                            <div
                                                class="p-1 flex justify-center items-center"
                                            >
                                                {{ t.id }}
                                            </div>
                                            <div
                                                class="p-1 flex justify-center items-center"
                                            >
                                                {{ t.patient_id }}
                                            </div>
                                            <div
                                                class="p-1 flex justify-center items-center"
                                            >
                                                {{
                                                    institutions[
                                                        t.from_institution_id -
                                                            1
                                                    ].name
                                                }}
                                            </div>
                                            <div
                                                class="p-1 flex justify-center items-center"
                                            >
                                                {{
                                                    t.to_institution_id
                                                        ? institutions[
                                                              t.to_institution_id -
                                                                  1
                                                          ].name
                                                        : "N/A"
                                                }}
                                            </div>
                                            <div
                                                class="p-1 flex justify-center items-center"
                                            >
                                                {{
                                                    formatDateTime(
                                                        t.updated_timestamp,
                                                        true
                                                    )
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                </Transition>

                                <!-- Request -->
                                <Transition>
                                    <div
                                        v-if="selected_tab === 2"
                                        class="p-3 flex flex-wrap max-h-[500px] overflow-y-auto"
                                    >
                                        <!-- Headers -->
                                        <div
                                            class="grid grid-cols-5 w-full text-white text-center"
                                        >
                                            <div
                                                v-for="(
                                                    h, index
                                                ) in requested_headers"
                                                :key="index"
                                                class="w-full h-full bg-gray py-1"
                                            >
                                                <div
                                                    class="h-full flex justify-center items-center"
                                                    :class="{
                                                        'border-r border-white/50':
                                                            index !==
                                                            transferring_headers.length -
                                                                1,
                                                    }"
                                                >
                                                    {{ $t(h) }}
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Body -->
                                        <div
                                            v-for="(t, index) in requested"
                                            :key="index"
                                            class="p-2 cursor-pointer hover:bg-gray/20 transition w-full bg-gray/5 border-x border-b border-gray/50 grid grid-cols-5"
                                            @click="cancelRequest(t)"
                                        >
                                            <div
                                                class="p-1 flex justify-center items-center"
                                            >
                                                {{ t.id }}
                                            </div>
                                            <div
                                                class="p-1 flex justify-center items-center"
                                            >
                                                {{ t.patient_id }}
                                            </div>
                                            <div
                                                class="p-1 flex justify-center items-center"
                                            >
                                                {{ t.current_condition }}
                                            </div>
                                            <div
                                                class="p-1 flex justify-center items-center"
                                            >
                                                {{ t.reason }}
                                            </div>
                                            <div
                                                class="p-1 flex justify-center items-center"
                                            >
                                                {{ t.note }}
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>

                            <!-- Right status bar -->
                            <div
                                class="text-[12px] lg:border-l border-t pt-4 border-gray/20 h-full flex justify-start flex-col flex-wrap lg:pl-4"
                            >
                                <!-- Request Button -->
                                <div
                                    class="cursor-pointer hover:bg-red transition text-[16px] bg-darkred text-white flex p-2 justify-center items-center"
                                    @click="openRequestTransferModal"
                                >
                                    {{ $t("request_transfer") }}
                                    <img
                                        src="../assets/request.svg"
                                        class="w-5 h-5 ml-2"
                                    />
                                </div>

                                <div
                                    class="mt-4 mb-1 flex text-center h-fit bg-gray w-full text-white py-1"
                                >
                                    <div class="grow">
                                        {{ $t("transfer_request") }}
                                    </div>
                                    <span
                                        class="relative flex h-3 w-3 -mt-2.5 -mr-1"
                                        v-if="request.length"
                                    >
                                        <span
                                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"
                                        ></span>
                                        <span
                                            class="relative inline-flex rounded-full h-3 w-3 bg-red"
                                        ></span>
                                    </span>
                                </div>

                                <Transition name="fade">
                                    <div
                                        v-if="!request.length"
                                        class="bg-gray/80 p-2 flex justify-center text-white/60"
                                    >
                                        {{ $t("no_request") }}
                                    </div>
                                </Transition>

                                <Transition name="fade">
                                    <div
                                        class="overflow-y-auto max-h-[600px] p-1"
                                        v-if="request.length"
                                    >
                                        <div
                                            class="hover:bg-gray transition cursor-pointer grid grid-cols-2 gap-2 ursor-pointer mb-1 p-1 text-[12px] text-white text-left bg-gray/70 slide-in-left-to-right"
                                            v-for="(r, index) in request"
                                            :key="index"
                                            :style="{
                                                'animation-delay': `${
                                                    0.1 + index * 0.2
                                                }s`,
                                            }"
                                            @click="acceptRequest(r)"
                                        >
                                            <div
                                                class="flex items-center justify-between backdrop-blur p-2 py-1 border-b border-white/20"
                                            >
                                                <strong>{{
                                                    $t("request_id")
                                                }}</strong>
                                                <div class="text-yellow ml-2">
                                                    {{ r.id }}
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center justify-between backdrop-blur p-2 py-1 border-b border-white/20"
                                            >
                                                <strong>{{
                                                    $t("from")
                                                }}</strong>
                                                <div class="text-yellow ml-2">
                                                    {{
                                                        institutions &&
                                                        institutions.length >
                                                            r.from_institution_id -
                                                                1
                                                            ? institutions[
                                                                  r.from_institution_id -
                                                                      1
                                                              ].name
                                                            : "Unknown Institution"
                                                    }}
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center justify-between backdrop-blur p-2 py-1 border-b border-white/20"
                                            >
                                                <strong>{{
                                                    $t("patient_id")
                                                }}</strong>
                                                <div class="text-yellow ml-2">
                                                    {{ r.patient_id }}
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center justify-between backdrop-blur p-2 py-1 border-b border-white/20"
                                            >
                                                <strong>{{
                                                    $t("current_condition")
                                                }}</strong>
                                                <div class="text-yellow ml-2">
                                                    {{ r.current_condition }}
                                                </div>
                                            </div>

                                            <div
                                                class="backdrop-blur p-2 py-1 col-span-2"
                                            >
                                                <strong>
                                                    {{
                                                        $t(
                                                            "reason_for_transfer"
                                                        )
                                                    }}
                                                </strong>
                                                <div
                                                    class="text-yellow text-right"
                                                >
                                                    {{ r.reason }}
                                                </div>

                                                <strong class="italic">
                                                    {{ $t("note") }}
                                                </strong>
                                                <div
                                                    class="italic text-yellow text-right"
                                                >
                                                    {{ r.note }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    watch: {
        async placed_patient(newValue) {
            if (newValue !== null) {
                const regex = /\[\d+\]\s(?:[a-zA-Z]+\s?)+/;
                const isMatch = regex.test(newValue);

                if (isMatch) {
                    // retrieve profile image here
                    const [, id, name] = newValue.match(/\[(\d*)\]\s*(.*)/);

                    this.profile_picture_url = "loading";
                    const response = await this.axios.get(
                        this.api_url + "/profile-picture/" + id,
                        {
                            headers: {
                                Authorization: this.user.passcode,
                            },
                        }
                    );

                    const profilePicture = response.data;

                    this.profile_picture_url = `data:${profilePicture.mimetype};base64,${profilePicture.buffer}`;
                }
            }
        },
    },
    data() {
        return {
            user: {
                id: null,
                name: null,
                passcode: null,
            },
            is_verified: true, // false in default
            is_initiated: true, // false in default
            is_access_denied: false,
            is_sidebar_expanding: false,
            is_manage_bed_modal_shown: false,
            is_transferring_info_shown: false,
            is_place_patient_modal_shown: false,
            is_request_transfer_modal_shown: false,
            placed_patient: null,
            selected_request: null,
            profile_picture_url: null,
            selected_events: [],
            selected_tab: 0,
            added_bed_no: null,
            removed_beds: null,
            manage_bed: null,
            api_url: "http://127.0.0.1:3000",
            records: [],
            transferring: [],
            transferring_headers: [
                "id",
                "patient_id",
                "from",
                "to",
                "transferring_since",
            ],
            requested_headers: [
                "id",
                "patient_id",
                "current_condition",
                "reason_for_transfer",
                "note",
            ],
            request: [],
            ane_beds: [],
            institutions: null,
            requested: [],
            patients: [],
            placing_bed_id: null,
            new_request: { note: null, reason: null, current_condition: null },
            selected_bed: null,
        };
    },
    computed: {},
    async created() {
        console.log("CREATED");
        this.user.passcode = await sessionStorage.getItem("passcode");
        const user = await JSON.parse(sessionStorage.getItem("user"));
        this.user.id = user.id;
        this.user.role = user.role;

        await this.fetch();

        this.fetchInterval = setInterval(async () => {
            await this.fetch();
        }, 15000);
    },
    methods: {
        async handleArrivedTransferringPatient() {
            const id = this.placed_patient;
            const bedId = this.selected_bed;

            const response = await this.axios.post(
                this.api_url + `/bed/place/${bedId}/${id}`,
                {},
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );

            if (response.data.message)
                this.$swal({
                    title: "Bed",
                    text: "The patient is placed successfully",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                });
            await this.closeCompleteTransferModal();
            await this.fetch();
        },
        closeCompleteTransferModal() {
            this.selected_bed = null;
            this.is_complete_transfer_modal_shown = false;
        },
        completeTransfer(bedId) {
            this.selected_bed = bedId;
            this.is_complete_transfer_modal_shown = true;
        },
        async acceptRequest(request) {
            const available = Array.from(this.ane_beds).filter(
                (b) => b.is_resolved
            );
            if (available.length > 0) {
                const response = await this.axios.post(
                    this.api_url + `/bed/reserve/${available[0].id}`,
                    {
                        request_id: request.id,
                    },
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );

                if (response.data.message) {
                    this.$swal({
                        title: "Transfer Request",
                        text: "Accepted and a bed is reserved.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    });

                    await this.fetch();
                } else {
                    this.$swal({
                        title: "Transfer Request",
                        text: "Failed Acceptance.",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            } else {
                this.$swal({
                    title: "Capacity Overload",
                    text: "Not enough available beds to accept transferred patient.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        },
        async cancelRequest(request) {
            const isConfirmed = await this.$swal({
                title: "Are you sure?",
                text: "You are about to cancel the request.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, keep it",
            });

            if (isConfirmed.value) {
                const response = await this.axios.delete(
                    this.api_url + "/patient-transfer/" + request.id,

                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );

                if (response.data.message) {
                    this.$swal({
                        title: "Cancel Transfer Request",
                        text: "Succeess.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    });

                    await this.fetch();
                } else {
                    this.$swal({
                        title: "New Transfer Request",
                        text: "Failed.",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            }
        },
        async openRequestTransferModal() {
            await this.fetchPatients();
            this.is_request_transfer_modal_shown = true;
        },
        async closeRequestTrasferModal() {
            this.is_request_transfer_modal_shown = false;
            await this.resetRequestTransfer();
        },
        async handleRequestTransfer() {
            if (
                !(
                    this.new_request.note &&
                    this.new_request.reason &&
                    this.placed_patient &&
                    this.new_request.current_condition
                )
            ) {
                this.$swal({
                    title: "New Transfer Request",
                    text: "Please fill in all the field",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
                return;
            } else {
                // Submit
                const [, id, name] =
                    this.placed_patient.match(/\[(\d*)\]\s*(.*)/);

                const response = await this.axios.post(
                    this.api_url + "/patient-transfer/add",
                    {
                        patient_id: id,
                        note: this.new_request.note,
                        reason: this.new_request.reason,
                        current_condition: this.new_request.current_condition,
                    },
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );

                if (response.data.message) {
                    this.$swal({
                        title: "New Transfer Request",
                        text: "New request added successfully",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    });

                    await this.fetch();
                } else {
                    this.$swal({
                        title: "New Transfer Request",
                        text: "New request added failed.",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
                await this.closeRequestTrasferModal();
            }
        },
        async handlePlacePatient() {
            const [, id, name] = this.placed_patient.match(/\[(\d*)\]\s*(.*)/);

            const response = await this.axios.post(
                this.api_url + `/bed/place/${this.placing_bed_id}/${id}`,
                {},
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );

            if (response.data.message)
                this.$swal({
                    title: "Bed",
                    text: "The patient is placed successfully",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                });
            await this.closePlacePatientModal();
            await this.fetch();
        },
        async resolveBed(bed_id) {
            const response = await this.axios.post(
                this.api_url + `/bed/resolve/${bed_id}`,
                {},
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );

            if (response.data.message)
                this.$swal({
                    title: "Bed",
                    text: "Resolved Successfully",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                });
            this.fetch();
        },
        async closePlacePatientModal() {
            this.is_place_patient_modal_shown = false;
            await this.resetPlacePatient();
        },
        async placePatient(bed_id) {
            await this.fetchPatients();
            this.is_place_patient_modal_shown = true;
            await this.resetPlacePatient();
            this.placing_bed_id = bed_id;
        },
        async fetchPatients() {
            const response = await this.axios.get(this.api_url + "/patients", {
                headers: {
                    Authorization: this.user.passcode,
                },
            });

            this.patients = response.data.message;
        },
        resetPlacePatient() {
            this.placed_patient = null;
            this.profile_picture_url = null;
            this.placing_bed_id = null;
        },
        resetRequestTransfer() {
            this.placed_patient = null;
            this.profile_picture_url = null;
            this.new_request.reason = null;
            this.new_request.current_condition = null;
            this.new_request.note = null;
        },
        openTransferringInfo(e) {
            this.selected_request = e;
            this.is_transferring_info_shown = true;
        },
        closeTransferringInfo() {
            this.is_transferring_info_shown = false;
        },
        formatDateTime(isoString, needTime = false) {
            const date = new Date(isoString);

            // Get individual date and time components
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            // Create the formatted date string
            let formattedDateTime = `${year}/${month}/${day}`;

            // Include time component if needTime is true
            if (needTime) {
                const hours = String(date.getHours()).padStart(2, "0");
                formattedDateTime += ` [${hours}:00]`;
            }

            return formattedDateTime;
        },
        closeManageBedModal() {
            if (this.manage_bed === "add") {
            } else if (this.manage_bed === "remove") {
            }

            this.is_manage_bed_modal_shown = false;
            this.manage_bed = null;
            this.added_bed_no = null;
            this.removed_beds = null;
        },
        openManageBedModal() {
            this.is_manage_bed_modal_shown = true;
        },
        async fetch() {
            try {
                // Beds Info
                const response = await this.axios.get(this.api_url + "/beds", {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                });
                this.ane_beds = response.data.message;

                // Transferring Info
                const response_transferring = await this.axios.get(
                    this.api_url + "/patient-transfer/transferring",
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );
                this.transferring = response_transferring.data.message;

                // Requested Info
                const response_requested = await this.axios.get(
                    this.api_url + "/patient-transfer/requested",
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );
                this.requested = response_requested.data.message;

                // Request
                const response_transfer_request = await this.axios.get(
                    this.api_url + "/patient-transfer/request",
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );

                this.request = response_transfer_request.data.message;

                // Institutions
                const response_ins = await this.axios.get(
                    this.api_url + "/institutions",
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );
                this.institutions = response_ins.data.message;
            } catch (e) {
                console.error(e.message);
            }
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },
    },
};
</script>

<style></style>
