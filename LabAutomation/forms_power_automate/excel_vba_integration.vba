
        ' VBA Code for Excel Integration with Power Automate
        ' Place this in the Excel workbook's VBA editor
        
        Sub UpdateInventoryFromForm()
            ' This subroutine updates inventory when called by Power Automate
            Dim ws As Worksheet
            Dim lastRow As Long
            Dim itemNum As String
            Dim description As String
            Dim handCount As Long
            Dim category As String
            
            ' Get parameters from Power Automate
            itemNum = Range("A1").Value ' Power Automate will put data here
            description = Range("B1").Value
            handCount = Range("C1").Value
            category = Range("D1").Value
            
            ' Determine which sheet to update
            Select Case UCase(category)
                Case "CHEMISTRY"
                    Set ws = Worksheets("CHEMISTRY")
                Case "HEMATOLOGY"
                    Set ws = Worksheets("HEMATOLOGY")
                Case "URINALYSIS"
                    Set ws = Worksheets("URINALYSIS")
                Case "KITS"
                    Set ws = Worksheets("KITS")
                Case "MISCELLANEOUS"
                    Set ws = Worksheets("MISCELLANEOUS")
                Case Else
                    MsgBox "Invalid category: " & category
                    Exit Sub
            End Select
            
            ' Find existing item or add new
            If itemNum <> "" Then
                ' Update existing item
                lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
                For i = 2 To lastRow
                    If ws.Cells(i, 1).Value = itemNum Then
                        ' Update the row
                        ws.Cells(i, 13).Value = handCount ' Hand Count column
                        ws.Cells(i, 27).Value = Now() ' Last Updated
                        ws.Cells(i, 28).Value = "Form Update" ' Updated By
                        
                        ' Recalculate status
                        Call CalculateItemStatus(ws, i)
                        Exit For
                    End If
                Next i
            Else
                ' Add new item
                lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row + 1
                ws.Cells(lastRow, 2).Value = description
                ws.Cells(lastRow, 13).Value = handCount
                ws.Cells(lastRow, 27).Value = Now()
                ws.Cells(lastRow, 28).Value = "Form Update"
                
                ' Calculate status for new item
                Call CalculateItemStatus(ws, lastRow)
            End If
            
            ' Save the workbook
            ThisWorkbook.Save
            
            ' Clear the input area
            Range("A1:D1").ClearContents
        End Sub
        
        Sub CalculateItemStatus(ws As Worksheet, row As Long)
            ' Calculate status based on hand count vs PAR level
            Dim handCount As Long
            Dim parLevel As Long
            Dim minStock As Long
            Dim status As String
            
            handCount = ws.Cells(row, 13).Value ' Hand Count
            parLevel = ws.Cells(row, 10).Value ' PAR Level
            minStock = ws.Cells(row, 11).Value ' Min Stock
            
            If handCount = 0 Then
                status = "OUT OF STOCK"
            ElseIf handCount <= minStock Then
                status = "CRITICAL LOW"
            ElseIf handCount < 10 Then
                status = "LOW STOCK"
            Else
                status = "OK"
            End If
            
            ws.Cells(row, 16).Value = status ' Status column
        End Sub
        
        Sub SendInventoryAlert()
            ' Send alert if critical items found
            Dim ws As Worksheet
            Dim lastRow As Long
            Dim criticalCount As Long
            Dim alertMessage As String
            
            criticalCount = 0
            alertMessage = "Critical inventory items found:" & vbCrLf & vbCrLf
            
            ' Check all sheets for critical items
            For Each ws In Worksheets
                If ws.Name <> "DASHBOARD" And ws.Name <> "EXPIRING_ITEMS" Then
                    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
                    For i = 2 To lastRow
                        If ws.Cells(i, 16).Value = "OUT OF STOCK" Or ws.Cells(i, 16).Value = "CRITICAL LOW" Then
                            criticalCount = criticalCount + 1
                            alertMessage = alertMessage & ws.Name & ": " & ws.Cells(i, 2).Value & vbCrLf
                        End If
                    Next i
                End If
            Next ws
            
            If criticalCount > 0 Then
                MsgBox alertMessage, vbCritical, "Inventory Alert"
            End If
        End Sub
        